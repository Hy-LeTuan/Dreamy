from flask import Flask, request, render_template, flash, jsonify
import os

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/audio", methods=["GET", "POST"])
def audio():
    if request.method == "GET":
        return render_template("happy.html")
    else:
        if 'audio' not in request.files:
            return jsonify({'error': 'No file uploaded'})

        uploaded_file = request.files['audio']
        file_path = "static/recordings"
        filename = uploaded_file.filename
        uploaded_file.save(os.path.join(file_path, filename))

        return jsonify({'status': 'File uploaded successfully'})


if __name__ == "__main__":
    app.run()
