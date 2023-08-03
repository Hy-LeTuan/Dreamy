import requests


def get_question(response):
    for question in response:
        print(
            f"Question: {question['question']}, Answer: {question['answer']}, Options: {question['options']}")


url = "https://api.opexams.com"
api_key = "qtteFO3qd0O2HhcbTPeNu3B1qiqWJsN"

headers = {
    "api-key": api_key,
    "request-type": "test"
}

data = {
    "type": "contextBased",
    "context": "Plants are very useful to our life. Plants provide nutritious content, oxygen and most importantly, eliminate carbon dioxide for us. ",
    "questionType": "TF",
    "language": "Vietnamese",
}

response = requests.post(f"{url}/questions-generator",
                         headers=headers, json=data)
response = response.json()["data"]
get_question(response)
