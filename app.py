from flask import Flask, request, render_template, redirect, flash, session
import os
import time
from faster_whisper import WhisperModel
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
from helpers import login_required, apology, get_question
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

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

MODEL = WhisperModel("large-v2", device="cpu", compute_type="int8")


# INITIALIZE TRANSCRIPTION MODEL

SUM_MODEL_TOKENIZER = AutoTokenizer.from_pretrained(
    "VietAI/vit5-base-vietnews-summarization")
SUM_MODEL = AutoModelForSeq2SeqLM.from_pretrained(
    "VietAI/vit5-base-vietnews-summarization")
SUM_MODEL.to("cpu")


# SUMMARIZE TEXT

def summarize_function(sentence, path):
    encoding = SUM_MODEL_TOKENIZER(sentence, return_tensors="pt")

    input_ids, attention_masks = encoding["input_ids"].to(
        "cpu"), encoding["attention_mask"].to("cpu")

    outputs = SUM_MODEL.generate(
        input_ids=input_ids, attention_mask=attention_masks,
        max_length=3000,
        early_stopping=True
    )
    with open(path, "w", encoding="utf-8") as f:
        for output in outputs:
            line = SUM_MODEL_TOKENIZER.decode(
                output, skip_special_tokens=True, clean_up_tokenization_spaces=True)
            f.write(line)

# CHECK INPUT SAFETY


def check_safety(text):
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
        return render_template("login.html")
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


@app.route("/reset")
def reset():
    pass


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
        elif not check_safety(username):
            return apology("Username contains special character.", 403)
        elif db.session.execute(db.Select(User).filter_by(username=username)).first() is not None:
            return apology("Username already taken, please try another one.", 403)
        else:
            user = User(username=username,
                        password=generate_password_hash(password))
            db.session.add(user)
            db.session.commit()
        return redirect("/")


@app.route("/record", methods=["GET", "POST"])
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
            # LOAD AND CHECK AUDIO
            numbering = len(os.listdir(app.config["UPLOAD_FOLDER"]))
            filename = f"recording_{numbering}.wav"
            uploaded_file.save(os.path.join(
                app.config["UPLOAD_FOLDER"], filename))
            segments, info = MODEL.transcribe(os.path.join(
                app.config["UPLOAD_FOLDER"], filename), language="vi", beam_size=5, vad_filter=True)
            result = [segment.text for segment in segments][0]

            # RECORDING
            recording_path = os.path.join(
                app.config["UPLOAD_FOLDER"], filename)
            record = Recording(path=recording_path, subject=upload_subject)
            session["recording_path"] = recording_path
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
            session["transcribe_path"] = os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}")

            db.session.commit()

        return redirect("/")


@app.route("/my_folder")
def subject_folder():
    """Show subjects, recordings and summaries. """
    # display subjects and files within.
    # files will be with dates attached
    # when clicked on subject's name, will redirect to "display"


@app.route("/display")
def display():
    """Display recording name and summay pairs"""
    pass


@app.route("/study-mode")
def study_mode():
    """In development"""
    pass


@app.route("/personal")
def personal():
    # display username + subjects + sidebar navigation
    pass


@app.route("/after-record")
def display_nearest():
    # display the summarization for the last recording
    # SUMMARIZE
    if session["transcript_path"] != None:
        summarize_path = os.path.join("static", "summarize")
        summarize = os.path.join(
            summarize_path, f"summarize_{len(os.listdir(summarize_path))}")
        result = ""
        with open(session["transcript_path"], "r", encoding="utf-8") as f:
            reader = f.readlines()
            for line in reader:
                result += line
        summarize_function(result, summarize)
        db.session.add(summarize)
        db.session.commit()
        session["transcript_path"] = None
        session["summarize_path"] = summarize
    summarize_text = ""
    with open(session["summarize_path"], "r", encoding="utf-8") as f:
        reader = f.readlines()
        for line in reader:
            summarize_text += line
    return render_template("after_record.html", audio=session["recording_path"], summarize_text=summarize_text)


@app.route("/feeback")
def feedback():
    """Allow users to send feedbacks"""
    # remember to redirect to thank you page
    pass


@app.route("/quiz")
def quiz():
    pass


if __name__ == "__main__":
    app.run()
