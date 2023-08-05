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

response = requests.post(
    f"{url}/questions-generator", headers=header, json=body)
print(response.json())
