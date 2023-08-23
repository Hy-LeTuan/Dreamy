import tiktoken
import openai
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

# response = requests.post(
#     f"{url}/questions-generator", headers=header, json=body)
# print(response.json()["data"])

api_key = "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"


response = openai.ChatCompletion.create(
    api_key=api_key,
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant",
            "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
)
