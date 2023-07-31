from flask import Flask, request, render_template, redirect, flash, session
import os
import time
import whisper
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
from helpers import login_required
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

# INITIALIZE DATABASE
db = SQLAlchemy()
app = Flask(__name__)
app.secret_key = "secret"

# CONFIGURATIONS
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///instance/database.db"
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.path.join("static", "recordings")
BASE_AUDIO = app.config["UPLOAD_FOLDER"]
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
db.init_app(app)

# INITIALIZE TRANSCRIPTION MODEL
if torch.cuda.is_available():
    device = torch.device("cuda")

    print('There are %d GPU(s) available.' % torch.cuda.device_count())

    print('We will use the GPU:', torch.cuda.get_device_name(0))
else:
    print('No GPU available, using the CPU instead.')
    device = torch.device("cpu")

SUM_MODEL = T5ForConditionalGeneration.from_pretrained(
    "NlpHUST/t5-small-vi-summarization")
SUM_MODEL_TOKENIZER = T5Tokenizer.from_pretrained(
    "NlpHUST/t5-small-vi-summarization", legacy=False)
SUM_MODEL.to(device)

# DEFINE USER TABLES


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)


class Recordings(db.Model):
    __tablename__ = "recordings"
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String, nullable=False)
    subject = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", backref="recordings")


class Transcripts(db.Model):
    __tablename__ = "transcripts"
    id = db.Column(db.Integer, primary_key=True)
    trans_path = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", backref="transcripts")


with app.app_context():
    db.create_all()

# AUDIO MODEL
MODEL = whisper.load_model("medium")

# SUMMARIZE TEXT


def summarize(src):
    tokenized_text = SUM_MODEL_TOKENIZER.encode(
        src, return_tensors="pt").to(device)
    SUM_MODEL.eval()
    summary_ids = SUM_MODEL.generate(
        tokenized_text,
        max_length=256,
        num_beams=5,
        repetition_penalty=2.5,
        length_penalty=1.0,
        early_stopping=True,
        min_length=150
    )
    output = SUM_MODEL_TOKENIZER.decode(
        summary_ids[0], skip_special_tokens=True)
    return output


@app.route("/")
# @login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == "GET":
        return render_template("user/login.html")
    else:
        if not request.form.get("username"):
            return render_template("apology.html", error="Username not entered")


@app.route("/logout")
def logout():
    pass


@app.route("/audio", methods=["GET", "POST"])
# @login_required
def audio():
    if request.method == "GET":
        return render_template("audio.html")
    else:
        if 'audio' not in request.files:
            flash("Error, file not uploaded.")
            time.sleep(50)
            return redirect(request.url)

        uploaded_file = request.files['audio']
        if uploaded_file.filename == "":
            flash("Error, file not uploaded.")
            time.sleep(50)
            return redirect(request.url)

        if uploaded_file:
            numbering = len(os.listdir(app.config["UPLOAD_FOLDER"]))
            filename = f"recording_{numbering}.wav"
            uploaded_file.save(os.path.join(
                app.config["UPLOAD_FOLDER"], filename))
            result = MODEL.transcribe(os.path.join(
                app.config["UPLOAD_FOLDER"], filename), language="vi", fp16=False, verbose=True, patience=2, beam_size=5)
            transcribe_path = os.path.join(
                "static", "transcribes")
            transcribe_number = len(os.listdir(transcribe_path))
            with open(os.path.join(transcribe_path, f"transcribe_{transcribe_number}"), "w", encoding="utf-8") as f:
                f.write(result["text"] + "\n")
            # user_id = session["user_id"]
        return redirect("/")


if __name__ == "__main__":
    app.run()
