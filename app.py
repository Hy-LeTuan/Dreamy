from flask import Flask, request, render_template, redirect, flash
import os
import time
import whisper

app = Flask(__name__)

MODEL = whisper.load_model("small")
app.config["UPLOAD_FOLDER"] = "static/recordings/"
app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024 * 1024
BASE_AUDIO = app.config["UPLOAD_FOLDER"]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/audio", methods=["GET", "POST"])
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
                app.config["UPLOAD_FOLDER"], filename))
            transcribe_path = os.path.join("static", "transcribes")
            transcribe_number = len(os.listdir(transcribe_path))
            with open(os.path.join(transcribe_path, f"transcribe_{transcribe_number}"), "r") as f:
                f.write(result["text"] + "\n")
        return redirect("/")


if __name__ == "__main__":
    app.run()
