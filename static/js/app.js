document.addEventListener("DOMContentLoaded", async () => {
	// DOM content and audio object
	const recordButton = document.getElementById("recordButton");
	const stopButton = document.getElementById("stopButton");
	const audioPlayer = document.getElementById("audioPlayer");
	stopButton.disabled = true;
	const audioContext = new (window.AudioContext ||
		window.webkitAudioContext)();
	const constraints = { audio: true };
	let gumStream, input, rec;

	recordButton.addEventListener("click", async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(
				constraints
			);
			gumStream = stream;
			input = audioContext.createMediaStreamSource(stream);
			rec = new WebAudioRecorder(input, {
				workerDir: "static/recordings/", // required
				encoding: "mp3",
				numChannels: 1, // mono recording requires only 1 channel
				onEncoderLoading: function (recorder, encoding) {
					console.log("Loading " + encoding + " encoder...");
				},
				onEncoderLoaded: function (recorder, encoding) {
					console.log(encoding + " encoder loaded");
				},
			});
			rec.record();
			stopButton.disabled = false;
		} catch (error) {
			console.error(error);
		}
	});

	stopButton.addEventListener("click", async () => {
		try {
			rec.stop();
			gumStream.getAudioTracks()[0].stop();
			rec.exportWAV(async (blob) => {
				const audioURL = URL.createObjectURL(blob);
				audioPlayer.src = audioURL;
				const formData = new FormData();
				formData.append("audio", blob, "recording.mp3");
				// /audio-upload
				const response = await fetch("/", {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				console.log(data);
			});
			stopButton.disabled = true;
		} catch (error) {
			console.error(error);
		}
	});
});
