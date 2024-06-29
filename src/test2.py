from transformers import pipeline

def get_explanation(text: str) -> str:
    # Load a pre-trained model and tokenizer from Hugging Face
    model_name = "gpt2"  # You can change this to any model available on Hugging Face
    generator = pipeline("text-generation", model=model_name)
    
    # Define the prompt
    prompt = "Can you explain " + text
    
    # Generate the explanation
    result = generator(prompt, max_length=100, num_return_sequences=1)
    
    # Extract and return the generated text
    explanation = result[0]['generated_text']
    return explanation

# Example usage
input_text = "the theory of relativity"
explanation = get_explanation(input_text)
print(explanation)
