import pytesseract
from pdf2image import convert_from_path

# Convert PDF to images
pdf_path = "/opt/paperless/media/documents/archive/0000009.pdf"
images = convert_from_path(pdf_path)

# Perform OCR on the images
ocr_results = []
for image in images:
    text = pytesseract.image_to_string(image,lang="ara+eng")
    ocr_results.append(text)

# Join the results into a single string
ocr_text = "".join(ocr_results)
print(ocr_text)