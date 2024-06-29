# import pytesseract
# import openai
# from pdf2image import convert_from_path

# def get_explanation(text: str) -> str:
#     # Define the prompt
#     prompt = text
    
#     # Generate the explanation using OpenAI API
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",  # You can change this to the desired model
#         messages=[
#             {"role": "system", "content": "Thoroughly extract key info as key=value or in abstract form if not possible"},
#             {"role": "user", "content": prompt}
#         ],
#         max_tokens=4096,
#         temperature=0.12
#     )
    
#     # Extract and return the generated text
#     explanation = response['choices'][0]['message']['content'].strip()
#     return explanation


# # def get_explanation(text: str) -> str:
# #     # Load a pre-trained model and tokenizer from Hugging Face
# #     model_name = "gpt2"  # You can change this to any model available on Hugging Face
# #     generator = pipeline("text-generation", max_length=10000, truncation=True, model=model_name)
    
# #     # Define the prompt
# #     prompt = "Can you make explain the following and note out crucial points in card format or in tabular format according to the text you sense \n " + text
    
# #     # Generate the explanation
# #     result = generator(prompt)
    
# #     # Extract and return the generated text
# #     explanation = result[0]['generated_text']
# #     return explanation


# # Convert PDF to images
# pdf_path = "/opt/paperless/media/documents/archive/0000009.pdf"
# images = convert_from_path(pdf_path)

# # Perform OCR on the images
# ocr_results = []
# for image in images:
#     text = pytesseract.image_to_string(image,lang="ara+eng")
#     ocr_results.append(text)

# # Join the results into a single string
# ocr_text = "".join(ocr_results)

# print(ocr_text)

# ex = get_explanation(ocr_text)

# print(ex)









# # # Example usage
# # input_text = "the theory of relativity"
# # explanation = get_explanation(input_text)
# # print(explanation)