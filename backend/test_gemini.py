from google import genai
import os

# 1. Set API key (recommended way)
os.environ["GOOGLE_API_KEY"] = "AIzaSyA0WFX6oYLJ_PBf0fxi84tD3EB0xCqihUE"

# 2. Create client
client = genai.Client()

# 3. Generate content
response = client.models.generate_content(
    model="models/gemini-2.5-flash",
    contents="Explain early blight disease in tomato in simple words for farmers."
)

# 4. Print response
print(response.text)
