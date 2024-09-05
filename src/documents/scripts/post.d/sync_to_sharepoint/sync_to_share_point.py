import os
import argparse
import requests
import pytesseract
from pdf2image import convert_from_path
#import config_sitccokw as conf  # Import config with an alias
import config_alherzkuwait as conf  # Import config with an alias
from llm import *

def get_access_token():
    url = conf.OAUTH_TOKEN_URL
    data = {
        'grant_type': 'refresh_token',
        'client_id': conf.CLIENT_ID,
        'client_secret': conf.CLIENT_SECRET,
        'redirect_uri': conf.REDIRECT_URI,
        'resource': conf.RESOURCE,
        'refresh_token': conf.REFRESH_TOKEN
    }
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    response = requests.post(url, data=data, headers=headers)
    
    if response.status_code == 200:
        response_data = response.json()
        return response_data.get('access_token')
    else:
        response.raise_for_status()

def ocr_pdf_to_text(pdf_path):
    text = ""
    images = convert_from_path(pdf_path)
    for image in images:
        text += pytesseract.image_to_string(image)
    return text

def upload_file_to_sharepoint(file_path, access_token):
    upload_url = f"{conf.SHAREPOINT_SITE}/_api/web/GetFolderByServerRelativeUrl('{conf.LIBRARY_NAME}')/Files/add(url='{os.path.basename(file_path)}',overwrite=true)"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
    }
    with open(file_path, 'rb') as file_content:
        response = requests.post(upload_url, headers=headers, data=file_content)

    # Check for HTTP errors
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except Exception as err:
        print(f"Other error occurred: {err}")
    else:
        print(f"Success: {response.status_code}")
        return response.json()  # Return the JSON response content

def update_metadata(file_url, metadata, access_token):
    item_url = f"{file_url}/ListItemAllFields"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-HTTP-Method": 'MERGE',
        "If-Match": '*'
    }
    response = requests.post(
        url=item_url,
        headers=headers,
        json=metadata
    )

    response.raise_for_status()  # Raise an error for bad responses

def process_pdf(file_path):
    try:
        access_token = get_access_token()
        
        extracted_text = ocr_pdf_to_text(file_path)
        upload_response = upload_file_to_sharepoint(file_path, access_token)
        file_url = upload_response["d"]['__metadata']['id']
        more_data = extract_invoice_data(extracted_text)
        #metadata = {'OcrData': extracted_text}
        #merged = {**more_data, **metadata}
        #print(more_data)
        update_metadata(file_url, more_data, access_token)

        print('File processed and metadata updated successfully')

    except Exception as e:
        print(f"An error occurred while processing file {file_path}: {str(e)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process a PDF file for OCR and upload to SharePoint.")
    parser.add_argument('file_name', type=str, help="Path to the PDF file to process.")
    args = parser.parse_args()

    if not os.path.isfile(args.file_name):
        print(f"File not found: {args.file_name}")
    else:
        process_pdf(args.file_name)
