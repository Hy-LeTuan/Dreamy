from flask import Flask, request, render_template, redirect, flash, url_for, session, jsonify
import os
import time
from faster_whisper import WhisperModel
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
from helpers import login_required, apology, get_question, check_api_usage
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
    filename = db.Column(db.String)
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

MODEL = WhisperModel("large-v2", device="cuda", compute_type="float16")


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
    result = ""
    with open(path, "w", encoding="utf-8") as f:
        for output in outputs:
            line = SUM_MODEL_TOKENIZER.decode(
                output, skip_special_tokens=True, clean_up_tokenization_spaces=True)
            f.write(line)
            result += line
    return result


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
    user = db.session.execute(db.Select(User).filter_by(
        id=session["user_id"])).first()[0]
    recording_number = len(user.recordings)
    summaries = len(user.summaries)
    transcripts = len(user.transcripts)
    return render_template("index.html", user=user, recording_number=recording_number, summaries=summaries, transcripts=transcripts)


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
        if row == None:
            return apology("Username not found, please check if username is entered correctly or register new account.", 403)
        elif check_password_hash(row[0].password, password) == False:
            return apology("Incorrect password, please try again.", 403)
        else:
            session["user_id"] = row[0].id
        return redirect("/")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/reset", methods=["GET", "POST"])
def reset():
    if request.method == "GET":
        return render_template("reset.html")
    else:
        user = db.session.execute(db.Select(User).filter_by(
            id=session["user_id"])).first()[0]
        new_password = request.form.get("new_password")
        if new_password == "":
            return apology(403, "No new password found, please try again")
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return redirect("/login")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("register.html")
    else:
        uploaded_username = request.form.get("username")
        uploaded_password = request.form.get("password")
        if uploaded_username == "":
            return apology("No username found, please enter username.", 403)
        elif uploaded_password == "":
            return apology("No password found, please enter password.", 403)
        elif not check_safety(uploaded_username):
            return apology("Username contains special character.", 403)
        elif db.session.execute(db.Select(User).filter_by(username=uploaded_username)).first() != None:
            return apology("Username already taken, please try another one.", 403)
        else:
            user = User(username=uploaded_username,
                        password=generate_password_hash(uploaded_password))
            db.session.add(user)
            db.session.commit()
            session["user_id"] = db.session.execute(
                db.select(User).filter_by(username=uploaded_username)).first()[0].id
        return redirect("/")


@app.route("/record", methods=["GET", "POST"])
@login_required
def record():
    if request.method == "GET":
        return render_template("record.html")
    else:
        response = {"ok": False}
        if 'audio' not in request.files:
            flash("Error, file not uploaded.")
            time.sleep(50)
            return apology("No audio recording file found, please try again", 403)

        uploaded_file = request.files['audio']
        upload_subject = request.form.get("subject")
        if uploaded_file.filename == "":
            flash("Error, file not uploaded.")
            time.sleep(50)
            return apology("Filename corrupted, please try again", 403)

        if upload_subject == "":
            return apology("No subject found, please try again", 403)

        if uploaded_file:
            # LOAD AND CHECK AUDIO
            numbering = len(os.listdir(app.config["UPLOAD_FOLDER"]))
            filename = f"recording_{numbering}.wav"
            uploaded_file.save(os.path.join(
                app.config["UPLOAD_FOLDER"], filename))
            segments, info = MODEL.transcribe(os.path.join(
                app.config["UPLOAD_FOLDER"], filename), language="vi", beam_size=5, vad_filter=True)
            result = [segment.text for segment in segments]
            if len(result) == 0:
                return apology("No speech found in recording, pleas try again", 403)
            result = result[0]
            # LOAD USER
            current_user = db.session.execute(db.Select(User).filter_by(
                id=session["user_id"])).first()[0]

            # RECORDING
            recording_path = os.path.join(
                app.config["UPLOAD_FOLDER"], filename)
            record = Recording(path=recording_path,
                               subject=upload_subject, user=current_user)
            session["recording_path"] = recording_path
            db.session.add(record)

            # TRANSCRIBE
            transcribe_path = os.path.join(
                "static", "transcripts")
            transcribe_number = len(os.listdir(transcribe_path))
            with open(os.path.join(transcribe_path, f"transcribe_{transcribe_number}"), "w", encoding="utf-8") as f:
                f.write(result)
            transribe = Transcript(subject=upload_subject, trans_path=os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}"), user=current_user)
            db.session.add(transribe)
            session["transcript_path"] = os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}")

            # SUMMARY
            summarize_path = os.path.join("static", "summarize")
            summarize = os.path.join(
                summarize_path, f"summarize_{len(os.listdir(summarize_path))}")
            summary = Summary(subject=upload_subject,
                              sum_path=summarize, user=current_user)
            session["summary_path"] = summarize
            db.session.add(summary)
            db.session.commit()
            response["ok"] = True
        return jsonify(response)


@app.route("/apology")
def route_apology():
    return render_template("apology.html", top=403, bottom="Opps, looks like there is something wrong. Please try again ")


@app.route("/my_folder")
def my_folder():
    """Show subjects, recordings and summaries."""
    user = db.session.execute(db.Select(User).filter_by(
        id=session["user_id"])).first()[0]
    recordings = user.recordings
    record_subject_dict = {}
    for rec in recordings:
        filename = rec.filename if rec.filename != "" else "Untitled recording"
        if rec.subject.capitalize() in record_subject_dict:
            record_subject_dict[rec.subject].append(filename)
        else:
            record_subject_dict[rec.subject.capitalize()] = []
            record_subject_dict[rec.subject.capitalize()].append(filename)
    return render_template("my_folder.html", rec_subject=record_subject_dict)


@app.route("/display")
def display():
    """Display recording name and summay pairs"""
    user = db.session.execute(db.Select(User).filter_by(
        id=session["user_id"])).first()[0]
    recordings = user.recordings
    summaries = user.summaries
    recording_name = [record.filename if record.filename !=
                      "" else "Untitled recording" for record in recordings]
    all_summary = []
    subjects = []
    for summary in summaries:
        subjects.append(summary.subject)
        with open(summary.sum_path, "r", encoding="utf-8") as f:
            all_summary.append(f.readlines()[0])
    return render_template("display.html", recording_name=recording_name, subjects=subjects, all_summary=all_summary, length=len(recording_name))


@app.route("/study-mode")
def study_mode():
    """In development"""
    pass


@app.route("/after_record", methods=["POST", "GET"])
def after_record():
    """Display summarization for latest recording"""
    if request.method == "GET":
        result = ""
        with open(session["transcript_path"], "r", encoding="utf-8") as f:
            reader = f.readlines()
            for line in reader:
                result += line
        if os.path.exists(session["summary_path"]):
            summarize_text = ""
            with open(session["summary_path"], "r", encoding="utf-8") as f:
                summarize_text += f.readlines()[0]
            return render_template("after_record.html", summarize_text=summarize_text, transcribe_text=result)
        else:
            summarize_text = summarize_function(
                result + "</s>", session["summary_path"])
            return render_template("after_record.html", summarize_text=summarize_text, transcribe_text=result)
    else:
        filename = request.form.get("file_name")
        new_summary = request.form.get("new_summary")
        if filename != "":
            recording = db.session.execute(
                db.Select(Recording).filter_by(path=session["recording_path"])).first()[0]
            recording.filename = filename
            db.session.commit()
        if new_summary != "":
            with open(session["summary_path"], "w", encoding="utf-8") as f:
                f.write(new_summary)

        return redirect("/display")


@app.route("/feeback")
def feedback():
    """Allow users to send feedbacks"""
    pass


@app.route("/quiz", methods=["POST", "GET"])
def quiz():
    user = db.session.execute(db.Select(User).filter_by(
        id=session["user_id"])).first()[0]
    recordings = user.recordings
    if request.method == "GET":
        return render_template("quiz.html", records=recordings)
    else:
        question_type = request.form["question_type"]
        selected_options = request.form.getlist("recordings")

        # CHECK QUESTION TYPE
        if question_type == "":
            return apology("No question type selected, please try again", 403)

        # CHECK SELECT OPTIONS
        if selected_options == None:
            return apology("No recordings selected, please try again", 403)

        # GET SUMMARIES
        summaries = db.session.execute(db.Select(Summary).filter(
            Summary.id.in_(selected_options))).all()[0]
        print(selected_options)
        print(summaries)

        # GET CONTEXT
        context = ""
        for summary in summaries:
            with open(summary.sum_path, "r", encoding="utf-8") as f:
                context += f.readlines()[0]

        # CHECK API USAGE
        api_usage = check_api_usage()
        if "error" in api_usage:
            return apology(f"Error: {api_usage['error']}", 403)
        elif api_usage["creditsLeft"] <= 10:
            return apology("Error, invalid credits for API, please wait for website to update API", 403)

        # GET QUESTIONS
        questions = get_question(context, question_type)

        # CHECK QUESTION RESPONSE
        if "error" in questions:
            return apology(f"{questions['error']}", 403)
        questions = questions["data"]
        session["questions"] = questions
        return redirect(url_for("display_quiz"))


@app.route("/display_quiz", methods=["GET", "POST"])
def display_quiz():
    if request.method == "GET":
        return render_template("display_quiz.html", questions=session["questions"])
    else:
        wrong = {}
        for q in session["questions"]:
            id = q["id"]
            option = request.form.get(id)
            if option != q["answer"]:
                wrong[q["question"]] = (option, q["answer"])
        return render_template("correction.html", wrong=wrong)


if __name__ == "__main__":
    app.run()
