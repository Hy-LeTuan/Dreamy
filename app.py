from flask import Flask, request, render_template, redirect, flash, session
import os
import time
import whisper
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
from helpers import login_required, apology
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

# INITIALIZE DATABASE
app = Flask(__name__)
app.secret_key = "secret"

# CONFIGURATIONS
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.path.join("static", "recordings")
BASE_AUDIO = app.config["UPLOAD_FOLDER"]
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

db = SQLAlchemy(app)
Session(app)
# db.init_app(app)

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
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    recordings = db.relationship("Recording", backref="user")
    transcripts = db.relationship("Transcript", backref="user")
    summaries = db.relationship("Summary", backref="user")


class Recording(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    path = db.Column(db.String, nullable=False)
    subject = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Transcript(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    subject = db.Column(db.String, nullable=False)
    trans_path = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String, nullable=False)
    sum_path = db.Column(db.String, nullable=Flask)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


with app.app_context():
    db.create_all()

# AUDIO MODEL


MODEL = whisper.load_model("medium")

# SUMMARIZE TEXT


def summarize_function(src):
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

# CHECK INPUT SAFETY


def check_safty(text):
    dangerous = ["'", '"', '$', '#', '@', '%', '^', '&',
                 '*', '(', ')', '[', ']', '{', '}', "`", "~"]
    for char in text:
        if char in dangerous:
            return False
    return True


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == "GET":
        return render_template("user/login.html")
    else:
        if not request.form.get("username"):
            return apology("Username not provided.", 403)
        elif not request.form.get("password"):
            return apology("Password not provided.", 403)
        upload_username = request.form.get("username")
        password = request.form.get("password")
        row = db.session.execute(
            db.Select(User).filter_by(username=upload_username)).first()
        if row[0] is None:
            return apology("Username not found, please check if username is entered correctly or register new account.", 403)
        elif check_password_hash(row[0].password, password) == False:
            return apology("Incorrect password, please try again.", 403)
        else:
            session["user_id"] = row[0].id


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = request.form["username"]
        password = request.form["password"]
        if username == "":
            return apology("No username found, please enter username.", 403)
        elif password == "":
            return apology("No password found, please enter password.", 403)
        elif not check_safty(username):
            return apology("Username contains special character.", 403)
        elif db.session.execute(db.Select(User).filter_by(username=username)).first() is not None:
            return apology("Username already taken, please try another one.", 403)
        else:
            user = User(username=username,
                        password=generate_password_hash(password))
        return redirect("/")


@app.route("/audio", methods=["GET", "POST"])
@login_required
def audio():
    if request.method == "GET":
        return render_template("audio.html")
    else:
        if 'audio' not in request.files:
            flash("Error, file not uploaded.")
            time.sleep(50)
            return redirect(request.url)

        uploaded_file = request.files['audio']
        upload_subject = request.form["subject"]
        if uploaded_file.filename == "":
            flash("Error, file not uploaded.")
            time.sleep(50)
            return redirect(request.url)

        if upload_subject.filename == "":
            flash("Error, no subject found.")
            time.sleep(50)
            return redirect(request.url)

        if uploaded_file:
            # LOAD AND CHECK FILES
            numbering = len(os.listdir(app.config["UPLOAD_FOLDER"]))
            filename = f"recording_{numbering}.wav"
            uploaded_file.save(os.path.join(
                app.config["UPLOAD_FOLDER"], filename))
            result = MODEL.transcribe(os.path.join(
                app.config["UPLOAD_FOLDER"], filename), language="vi", fp16=False, verbose=True, patience=2, beam_size=5)

            # RECORDING
            recording_path = os.path.join(
                app.config["UPLOAD_FOLDER"], filename)
            record = Recording(path=recording_path, subject=upload_subject)
            db.session.add(record)

            # TRANSCRIBE
            transcribe_path = os.path.join(
                "static", "transcribes")
            transcribe_number = len(os.listdir(transcribe_path))
            with open(os.path.join(transcribe_path, f"transcribe_{transcribe_number}"), "w", encoding="utf-8") as f:
                f.write(result["text"])
            transribe = Transcript(subject=upload_subject, trans_path=os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}"))
            db.session.add(transribe)

            # SUMMARIZE
            summarize_path = os.path.join("static", "summarize")
            summarized = summarize_function(result["text"])
            with open(os.path.join(summarize_path, f"summarize_{len(os.listdir(summarize_path))}"), "w", encoding="utf-8") as f:
                f.write(summarized)
            summarize = os.path.join(
                summarize_path, f"summarize_{len(os.listdir(summarize_path))}")
            db.session.add(summarize)
            db.session.commit()

        return redirect("/")


if __name__ == "__main__":
    app.run()
