from flask import Flask, request, render_template

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def idnex():
    if request.method == "GET":
        return render_template("index.html")
    else:
        try:
            audio_file = request.files["audio"]
            audio_file.save("static/recordings/")
        except Exception as e:
            print(e)
        return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
