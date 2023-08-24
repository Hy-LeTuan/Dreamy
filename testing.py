import tiktoken
import openai
import requests
import time
# api_key = "qtteFO3qd0O2HhcbTPeNu3B1qiqWJsN"
# url = "https://api.opexams.com"

# header = {
#     "api-key": api_key,
#     "request-type": "test",
# }

# body = {
#     "type": "contextBased",
#     "context": "plants",
#     "questionType": "MCQ",
#     "language": "Vietnamese"
# }

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


# response = openai.ChatCompletion.create(
#     api_key=api_key,
#     model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system", "content": "You are a helpful assistant."},
#         {"role": "user", "content": "Who won the world series in 2020?"},
#         {"role": "assistant",
#             "content": "The Los Angeles Dodgers won the World Series in 2020."},
#         {"role": "user", "content": "Where was it played?"}
#     ]
# )

with open("output copy.txt", "r", encoding="utf-8") as f:
    conversation = [{"role": "system", "content": "You are a helpful assistant that summarizes lesson transcripts for computer science undergraduates in Vietnamese. The summary's length must be less than that of the transcript. You must also highlight important points of the transcript so that students can use the summary to study for an exam"}]
    counter = 0

    for line in f:
        if counter >= 3:
            time.sleep(61)
            counter = 0
        conversation.append({"role": "user", "content": line.strip()})
        response = openai.ChatCompletion.create(
            api_key=api_key,
            model="gpt-3.5-turbo-16k",
            messages=conversation,
        )
        assistant_reply = response.choices[0].message["content"]
        conversation.pop()
        conversation.append({"role": "assistant", "content": assistant_reply})
        counter += 1

    conversation.append(
        {"role": "user", "content": "Can you now please link all of the summaires above into 1 big summary and write it in Vietnamese."})
    response = openai.ChatCompletion.create(
        api_key=api_key,
        model="gpt-3.5-turbo-16k",
        messages=conversation
    )

    with open("test.txt", "w", encoding="utf-8") as f:
        f.write(response.choices[0].message["content"].strip())

    # counter = 0
    # summaries = []
    # for line in f:
    #     conversation.append({"role": "user", "content": line.strip()})
    #     if counter >= 3:
    #         time.sleep(62)
    #         counter = 0
    #     summaries.append(response.choices[0].message["content"].strip())
    #     counter += 1
