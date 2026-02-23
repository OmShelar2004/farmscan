from google import genai

client = genai.Client(
    api_key="AIzaSyA0WFX6oYLJ_PBf0fxi84tD3EB0xCqihUE"
)

models = client.models.list()

for m in models:
    print("MODEL NAME:", m.name)
    print("RAW MODEL OBJECT:", m)
    print("-" * 40)

