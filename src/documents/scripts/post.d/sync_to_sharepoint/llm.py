import openai
import json
import os

# Set OpenAI API key directly from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_invoice_data(ocred_text):
    messages = [
        {"role": "system", "content": "You are an assistant that extracts invoice information."},
        {"role": "user", "content": f"""
        Extract the following information from the given text:
        1. Doc No
        2. Doc Title
        3. Doc Deptartment
        
        The text is:
        {ocred_text}
        
        Provide the result in JSON format like this:
        {{
            "DocNo": "<Doc No>",
            "Title": "<Doc Title>",
            "Department": "<Doc Department>"
        }}
        """}
    ]

    try:
        # Request completion from OpenAI's chat model
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Using the chat-based model
            messages=messages,
            max_tokens=150,  # Adjust as needed
            temperature=0.2  # Lower temperature for more precise answers
        )

        # Print the raw response for debugging
        #print("Raw response:", response)

        # Extract the content from the response
        result = response.choices[0].message['content'].strip()

        # Print the raw result for debugging
        #print("Raw result:", result)

        # Remove any leading or trailing backticks or other unwanted characters
        if result.startswith('```json') and result.endswith('```'):
            result = result[7:-3].strip()
        elif result.startswith('```') and result.endswith('```'):
            result = result[3:-3].strip()

        #Basic validation to ensure it's a JSON-like structure
        if result.startswith('{') and result.endswith('}'):
            data = json.loads(result)
        else:
            print("Response does not look like valid JSON:", result)
            data = {"error": "Invalid JSON response"}

        return data

    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        return {"error": "JSON decoding error"}
    except Exception as e:
        print(f"Error extracting data: {e}")
        return {"error": str(e)}

# Example usage
if __name__ == "__main__":
    ocred_text = """
    Invoice No: 2408101400185
    Invoice Date: 25-08-2024
    """
    extracted_data = extract_invoice_data(ocred_text)
    print(json.dumps(extracted_data, indent=2))
