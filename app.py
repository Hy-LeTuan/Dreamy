from flask import Flask, request, render_template, redirect, flash, url_for, session, jsonify
import os
import time
from faster_whisper import WhisperModel
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
from helpers import login_required, apology, get_question, check_api_usage, check_login, text_segment_with_tokens, summarize, read_summary, text_segment_with_tokens_direct

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
    role = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    recordings = db.relationship("Recording", backref="user")
    transcripts = db.relationship("Transcript", backref="user")
    summaries = db.relationship("Summary", backref="user")
    quizzes = db.relationship("Quiz", backref="user")


class Recording(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    filename = db.Column(db.String, nullable=False)
    path = db.Column(db.String, nullable=False)
    topic = db.Column(db.String, nullable=False)
    folder = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Transcript(db.Model):
    id = db.Column(db.Integer, nullable=False, primary_key=True)
    filename = db.Column(db.String, nullable=False)
    folder = db.Column(db.String, nullable=False)
    topic = db.Column(db.String, nullable=False)
    trans_path = db.Column(db.String, nullable=False)
    summary = db.relationship("Summary", backref="transcript")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    filename = db.Column(db.String, nullable=False)
    folder = db.Column(db.String, nullable=False)
    transcript_id = db.Column(db.Integer, db.ForeignKey("transcript.id"))
    sum_path = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    quiz_path = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))


with app.app_context():
    db.create_all()

# AUDIO MODEL

MODEL = WhisperModel("large-v2", device="cuda", compute_type="int8")

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
def index():
    # chứa hình đại diện, tên tài khoản, gói sử dụng, email, mật khẩu.
    login_status = check_login()
    if login_status or db.session.execute(db.Select(User).filter_by(id=session["user_id"])).first() == None:
        return render_template("index.html")
    else:
        return redirect("/dashboard")


@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    if request.method == "GET":
        user = db.session.execute(db.Select(User).filter_by(
            id=session["user_id"])).first()[0]
        recordings = len(user.recordings)
        summaries = user.summaries
        transcripts = len(user.transcripts)

        folder = {}
        for sum in summaries:
            if folder.get(sum.folder) != None:
                folder[sum.folder].append(sum)
            else:
                folder[sum.folder] = [sum]

        return render_template("dashboard.html", r_length=recordings, s_length=len(summaries), t_length=transcripts, folder=folder)

    else:
        summary_id = request.form.get("summary_id")
        if summary_id == "":
            return apology("Bạn vui lòng chọn file tóm tắt để xem nhé", 403)
        summary = db.session.execute(
            db.Select(Summary).filter_by(id=summary_id)).first()[0]
        text = read_summary(summary.sum_path)

        return render_template("summary_from_dash.html", text=text)


@app.route("/profile")
def profile():
    pass


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
        role = request.form.get("role")
        if uploaded_username == "":
            return apology("No username found, please enter username.", 403)
        elif uploaded_password == "":
            return apology("No password found, please enter password.", 403)
        elif not check_safety(uploaded_username):
            return apology("Username contains special character.", 403)
        elif db.session.execute(db.Select(User).filter_by(username=uploaded_username)).first() != None:
            return apology("Username already taken, please try another one.", 403)
        elif role == "":
            return apology("Bạn vui lòng chọn vai trò của mình nhé", 403)
        else:
            user = User(username=uploaded_username,
                        password=generate_password_hash(uploaded_password), role=role)
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
        upload_subject = request.form.get("topic")
        folder = request.form.get("folder")
        record_filename = request.form.get("filename")

        # CHECK ERROR
        if uploaded_file.filename == "":
            flash("Error, file not uploaded.")
            time.sleep(50)
            return apology("Filename corrupted, please try again", 403)

        if upload_subject == "":
            return apology("No topic found, please try again", 403)

        if folder == "":
            folder = "Untitled"

        if record_filename == "":
            return apology("Bạn vui lòng điên tên cho recording này nhé", 403)

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
            # LOAD USER
            current_user = db.session.execute(db.Select(User).filter_by(
                id=session["user_id"])).first()[0]

            # RECORDING
            recording_path = os.path.join(
                app.config["UPLOAD_FOLDER"], filename)
            record = Recording(path=recording_path,
                               topic=upload_subject, user=current_user, filename=record_filename, folder=folder)
            db.session.add(record)

            # TRANSCRIBE
            transcribe_path = os.path.join(
                "static", "transcripts")
            transcribe_number = len(os.listdir(transcribe_path))
            with open(os.path.join(transcribe_path, f"transcribe_{transcribe_number}.txt"), "w", encoding="utf-8") as f:
                for seg in result:
                    f.write(seg)

            transribe = Transcript(topic=upload_subject, trans_path=os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}.txt"), user=current_user, filename=record_filename, folder=folder)
            db.session.add(transribe)
            session["transcript_path"] = os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}.txt")
            db.session.commit()

            response["ok"] = True
        else:
            return apology("Bạn vui lòng ghi âm trước khi bấm gửi nhé", 403)
        return jsonify(response)


@app.route("/upload_record", methods=["POST", "GET"])
def upload_record():
    if request.method == "GET":
        return render_template("upload_record.html")
    else:
        audio_file = request.files["audio_file"]
        upload_subject = request.form.get("topic")
        folder = request.form.get("folder")
        upload_filename = request.form.get("filename")

        # CHECK ERROR
        if audio_file.filename == "":
            flash("Error, file not uploaded.")
            time.sleep(50)
            return apology("Filename corrupted, please try again", 403)

        if upload_subject == "":
            return apology("No topic found, please try again", 403)

        if folder == "":
            folder = "Untitled"

        if upload_filename == "":
            upload_filename = "Untitled file"

        if audio_file:
            numbering = len(os.listdir(app.config["UPLOAD_FOLDER"]))
            filename = f"recording_{numbering}.wav"
            audio_file.save(os.path.join(
                app.config["UPLOAD_FOLDER"], filename))
            segments, info = MODEL.transcribe(os.path.join(
                app.config["UPLOAD_FOLDER"], filename), language="vi", beam_size=5, vad_filter=True)
            result = [segment.text for segment in segments]
            if len(result) == 0:
                return apology("No speech found in recording, pleas try again", 403)

            # LOAD USER
            current_user = db.session.execute(db.Select(User).filter_by(
                id=session["user_id"])).first()[0]

            # RECORDING
            recording_path = os.path.join(
                app.config["UPLOAD_FOLDER"], filename)
            record = Recording(path=recording_path,
                               topic=upload_subject, user=current_user, filename=upload_filename, folder=folder)
            db.session.add(record)

            # TRANSCRIBE
            transcribe_path = os.path.join(
                "static", "transcripts")
            transcribe_number = len(os.listdir(transcribe_path))
            with open(os.path.join(transcribe_path, f"transcribe_{transcribe_number}.txt"), "w", encoding="utf-8") as f:
                for seg in result:
                    f.write(seg.text
                            )
            transribe = Transcript(topic=upload_subject, trans_path=os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}.txt"), user=current_user, filename=upload_filename, folder=folder)
            db.session.add(transribe)
            session["transcript_path"] = os.path.join(
                transcribe_path, f"transcribe_{transcribe_number}.txt")
            db.session.commit()
            return redirect("/summary")
        else:
            return apology("Bạn vui lòng ghi âm trước khi bấm gửi nhé", 403)


@app.route("/apology")
def route_apology():
    return render_template("apology.html", top=403, bottom="Opps, looks like there is something wrong. Please try again ")


@app.route("/summary", methods=["POST", "GET"])
def summary():
    """Display summarization for latest recording"""
    if request.method == "GET":
        if session.get("transcript_path") != None:
            transcribe_text = ""
            with open(session["transcript_path"], "r", encoding="utf-8") as f:
                for line in f:
                    transcribe_text += line
            return render_template("summary_from_record.html", transcribe_text=transcribe_text)
        else:
            user = db.session.execute(
                db.Select(User).filter_by(id=session["user_id"])).first()[0]
            transcripts = user.transcripts
            return render_template("summary.html", transcripts=transcripts)
    else:
        if session.get("transcript_path") != None:
            length = request.form.get("length")

            # query recording and user
            transcript = db.session.execute(
                db.Select(Transcript).filter_by(trans_path=session["transcript_path"])).first()[0]
            user = db.session.execute(
                db.Select(User).filter_by(id=session["user_id"])).first()[0]

            # segment
            # text_segment_with_tokens(transcript.trans_path)

            # initialize summary object
            summarize_path = os.path.join("static", "summarize")
            summarize_path = os.path.join(
                summarize_path, f"summarize_{len(os.listdir(summarize_path))}.txt")

            # summarize
            summarize(session["transcript_path"],
                      length, summarize_path, transcript.topic, user.role)

            summary = Summary(topic=transcript.topic,
                              sum_path=summarize_path, user=user, transcript=transcript, folder=transcript.folder, filename=transcript.filename)
            db.session.add(summary)
            db.session.commit()
            # session["transcript_path"] = None

            return redirect(url_for("display_summary", summary_file_path=summarize_path))
        else:
            transcript_id = request.form.get("transcript_option")
            content = request.form.get("content")
            length = request.form.get("length")
            if length == None:
                return apology("Bạn vui lòng chọn kích thước cho recording nhé", 403)
            # check valid
            if transcript_id:
                transcript = db.session.execute(
                    db.Select(Transcript).filter_by(id=transcript_id)).first()[0]

                # get user
                user = db.session.execute(db.Select(user).filter_by(
                    id=session["user_id"])).first()[0]

                # segment
                text_segment_with_tokens(transcript.trans_path)

                # initialize summary object
                summarize_path = os.path.join("static", "summarize")
                summarize_path = os.path.join(
                    summarize_path, f"summarize_{len(os.listdir(summarize_path))}.txt")

                # summarize
                summarize(transcript.trans_path,
                          length, summarize_path, transcript.topic, user.role)
                summary = Summary(topic=transcript.topic,
                                  sum_path=summarize_path, user=user, transcript=transcript, folder=transcript.folder, filename=filename)
                db.session.add(summary)
                db.session.commit()
                return redirect("display_summary", summary_file_path=summarize_path)

            elif content:
                folder = request.form.get("folder")
                topic = request.form.get("topic")
                filename = request.form.get("filename")

                segment_path = os.path.join("static", "summary_segment")
                segment_path = os.path.join(
                    segment_path, f"segment_{len(os.listdir(segment_path))}.txt")
                text_segment_with_tokens_direct(segment_path, content)

                summarize_path = os.path.join("static", "summarize")
                summarize_path = os.path.join(
                    summarize_path, f"summarize_{len(os.listdir(summarize_path))}.txt")

                summarize(segment_path, length, summarize_path)

                summary = Summary(
                    topic=topic, filename=filename, folder=folder, user=user, sum_path=summarize_path)

                db.session.add(summary)
                db.session.commit()
                return redirect("display_summary", summary_file_path=summarize_path)

            else:
                return apology("Bạn vui lòng chọn một file ghi âm hoặc điền nội dung mình muốn tóm tắt trước khi bấm submit nhé", 403)


@app.route("/display_summary", methods=["POST", "GET"])
def display_summary():
    summary_file_path = request.args.get("summary_file_path")
    if request.method == "GET":
        text = read_summary(summary_file_path)
        return render_template("display_summary.html", text=text)
    else:
        new_summary = request.form.get("content")
        if new_summary != "":
            with open(summary_file_path, "r", encoding="utf-8") as f:
                f.write(new_summary)
        return redirect("/recording")


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
