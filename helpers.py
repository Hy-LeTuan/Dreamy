from flask import redirect, session, render_template
from flask import redirect, session
from functools import wraps
import requests
import tiktoken
import openai
import time


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


def apology(message, code=400):
    def escape(s):
        for old, new in [("-", "--"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code


def check_api_usage():
    api_key = "qtteFO3qd0O2HhcbTPeNu3B1qiqWJsN"
    url = "https://api.opexams.com"
    header = {
        "api-key": api_key
    }
    response = requests.get(f"{url}/questions-generator/usage", headers=header)
    response = response.json()
    return response


def get_question(context, question_type):
    """Response is a list of dictionaries, taken from reponse["data"]"""
    api_key = "qtteFO3qd0O2HhcbTPeNu3B1qiqWJsN"
    url = "https://api.opexams.com"
    header = {
        "api-key": api_key,
    }

    body = {
        "type": "contextBased",
        "context": context,
        "questionType": question_type,
        "language": "Vietnamese"
    }

    response = requests.post(
        f"{url}/questions-generator", headers=header, json=body).json()
    return response


def check_login():
    return session.get("user_id") == None


def text_segment_with_tokens(trans_path):
    token_limit = 1000
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo-16k")
    current_chunk = ""
    chunk_list = []
    current_token = 0
    with open(trans_path, "r", encoding="utf-8") as f:
        for line in f:
            for word in line.split():
                if current_token + len(encoding.encode(word)) <= token_limit:
                    current_token += len(encoding.encode(word))
                    current_chunk += word if current_chunk == "" else f" {word}"
                else:
                    chunk_list.append(current_chunk)
                    current_token = 0
                    current_chunk = ""
                    current_chunk += word
                    current_token += len(encoding.encode(word))

    with open(trans_path, "w", encoding="utf-8") as f:
        for chunk in chunk_list:
            f.write(f"{chunk}\n")


def summarize(trans_path, length, sum_path, subject, user_role="user"):
    api_key = "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"

    with open(trans_path, "r", encoding="utf-8") as f:
        conversation = [{"role": "system", "content": f"You are a helpful assistant that summarizes lesson transcripts for {user_role} in {subject} in Vietnamese. The summary's length must be {length}. You must also highlight important points of the transcript so that students can use the summary to perfectly understand the lesson without the need to re-read the transcript."}]
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
            conversation.append(
                {"role": "assistant", "content": assistant_reply})
            counter += 1

        conversation.append(
            {"role": "user", "content": "Can you please link all of the summaries above into 1 big summary and write it in Vietnamese."})
        response = openai.ChatCompletion.create(
            api_key=api_key,
            model="gpt-3.5-turbo-16k",
            messages=conversation
        )

        with open(sum_path, "w", encoding="utf-8") as f:
            f.write(response.choices[0].message["content"].strip())


def write_summary(sum_path):
    with open(sum_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                print(line)
            else:
                continue
