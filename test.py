import requests

API_KEY = "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"
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get("https://api.openai.com/v1/usage", headers=headers)

if response.status_code == 200:
    usage_data = response.json()
    print("Usage data:", usage_data)
    remaining_tokens = usage_data["data"]["remaining_tokens"]
    print("Remaining tokens:", remaining_tokens)
else:
    print("Failed to retrieve usage data:", response.text)
