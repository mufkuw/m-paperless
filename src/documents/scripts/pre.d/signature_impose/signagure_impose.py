import fitz  # PyMuPDF
from PIL import Image
import pytesseract
from pdf2image import convert_from_path
import io
import os
import argparse

# Configure Tesseract path if necessary
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'  # Update if needed

def find_signature_position(image):
    """
    Determine a reliable position to place the signature on the page.
    Returns a position within the bounds of the page.
    """
    img_width, img_height = image.size
    margin = 50
    return (img_width - 2 * margin, img_height - 2 * margin)  # Bottom-right corner with room

def overlay_signature_on_image(input_image_path, signature_path, output_image_path):
    """
    Overlay a signature image on a single image file.
    """
    # Load the signature image
    signature = Image.open(signature_path)
    print(f"Signature size: {signature.size}")

    # Load the target image
    target_image = Image.open(input_image_path)
    print(f"Target image size: {target_image.size}")

    # Calculate scaling factor and resize signature
    sig_width, sig_height = signature.size
    img_width, img_height = target_image.size
    scale_factor = min(
        (img_width - 100) / sig_width,
        (img_height - 100) / sig_height
    )
    if scale_factor > 1:
        scale_factor = 1
    new_size = (int(sig_width * scale_factor), int(sig_height * scale_factor))
    print(f"Resizing signature to: {new_size}")
    signature_resized = signature.resize(new_size, Image.LANCZOS)
    
    # Calculate position for the signature
    signature_position = find_signature_position(target_image)
    print(f"Signature position: {signature_position}")
    sig_x = signature_position[0] - new_size[0]
    sig_y = signature_position[1] - new_size[1]
    print(f"Signature coordinates: ({sig_x}, {sig_y})")
    
    # Add signature to the target image
    target_image.paste(signature_resized, (sig_x, sig_y), signature_resized)
    
    # Save the modified image
    target_image.save(output_image_path)
    print(f"Output image saved to: {output_image_path}")

def overlay_signature_on_pdf(input_pdf_path, signature_path, output_pdf_path):
    """
    Overlay a signature image on the last page of the PDF document.
    """
    # Load the signature image
    signature = Image.open(signature_path)
    print(f"Signature size: {signature.size}")

    # Convert PDF pages to images
    images = convert_from_path(input_pdf_path)
    print(f"Number of pages in PDF: {len(images)}")
    
    # Open the PDF file
    pdf_document = fitz.open(input_pdf_path)
    
    # Get the signature position from the last page
    signature_position = find_signature_position(images[-1])
    print(f"Signature position: {signature_position}")
    
    # Load the last page of the PDF
    last_page_num = len(pdf_document) - 1
    page = pdf_document.load_page(last_page_num)
    
    # Convert the page to an image
    pix = page.get_pixmap()
    img = Image.open(io.BytesIO(pix.tobytes()))
    img_width, img_height = img.size
    print(f"PDF page image size: {img_width}x{img_height}")

    # Calculate scaling factor and resize signature
    sig_width, sig_height = signature.size
    scale_factor = min(
        (img_width - 100) / sig_width,
        (img_height - 100) / sig_height
    )
    if scale_factor > 1:
        scale_factor = 1
    new_size = (int(sig_width * scale_factor), int(sig_height * scale_factor))
    print(f"Resizing signature to: {new_size}")
    signature_resized = signature.resize(new_size, Image.LANCZOS)
    
    # Calculate position for the signature
    sig_x = signature_position[0] - new_size[0]
    sig_y = signature_position[1] - new_size[1]
    
    # Ensure the signature is within the bounds of the page
    sig_x = max(0, min(sig_x, img_width - new_size[0]))
    sig_y = max(0, min(sig_y, img_height - new_size[1]))
    print(f"Adjusted signature coordinates: ({sig_x}, {sig_y})")
    
    # Convert signature image to bytes
    signature_bytes = io.BytesIO()
    signature_resized.save(signature_bytes, format='PNG')
    signature_bytes.seek(0)
    
    # Add signature to PDF page
    rect = fitz.Rect(sig_x, sig_y, sig_x + new_size[0], sig_y + new_size[1])
    page.insert_image(rect, stream=signature_bytes.read())
    
    # Save changes to a new PDF file
    pdf_document.save(output_pdf_path)
    pdf_document.close()
    print(f"Output PDF saved to: {output_pdf_path}")

def overlay_signature(input_path, signature_path, output_path):
    """
    Overlay a signature image on a PDF or image file.
    """
    # Determine file type
    file_ext = os.path.splitext(input_path)[1].lower()
    
    if file_ext in ['.pdf']:
        if output_path is None:
            raise ValueError("Output path is required for PDF files.")
        overlay_signature_on_pdf(input_path, signature_path, output_path)
    elif file_ext in ['.jpg', '.jpeg', '.png']:
        overlay_signature_on_image(input_path, signature_path, output_path)
    else:
        raise ValueError("Unsupported file type. Please provide a PDF or image file.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Overlay a signature image on a PDF or image file.')
    parser.add_argument('input', type=str, help='Path to the input PDF or image file.')
    parser.add_argument('signature', type=str, help='Path to the signature image file.')
    parser.add_argument('output', type=str, help='Path to save the output PDF or image file.')

    args = parser.parse_args()

    overlay_signature(args.input, args.signature, args.output)
