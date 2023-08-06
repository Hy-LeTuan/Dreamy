import requests
api_key = "qtteFO3qd0O2HhcbTPeNu3B1qiqWJsN"
url = "https://api.opexams.com"

header = {
    "api-key": api_key,
    "request-type": "test",
}

body = {
    "type": "contextBased",
    "context": "plants",
    "questionType": "MCQ",
    "language": "Vietnamese"
}

# response = requests.post(
#     f"{url}/questions-generator", headers=header, json=body)
# response = response.json()["data"]

# for q in response:
#     print(f"Question: {q['question']}")
#     print(f"Answer: {q['answer']}")
#     print(f"Options: {q['options']}")

response = requests.get(f"{url}/questions-generator/usage", headers=header)
print(response.json())
