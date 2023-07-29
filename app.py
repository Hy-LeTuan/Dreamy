from flask import Flask, request, render_template, redirect, flash, session
import os
import time
import whisper
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from flask_session import Session
from helpers import login_required

app = Flask(__name__)
db = SQLAlchemy()
app.secret_key = "secret"

# config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///instance/database.db"
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = os.path.join("static", "recordings")
BASE_AUDIO = app.config["UPLOAD_FOLDER"]
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
db.init_app(app)


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)


class Recordings(db.Model):
    __tablename__ = "recordings"
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user = db.relationship("User", backref="recordings")


with app.app_context():
    db.create_all()

# model
MODEL = whisper.load_model("medium")


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
            return render_template("apology.html", error="Username not entered")


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
        return redirect("/")


if __name__ == "__main__":
    app.run()
