"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("form");
	const startRecording = document.querySelector("#start-recording");
	const stopRecording = document.querySelector("#stop-recording");
	const recordStatus = document.querySelector("#record-status");
	const progressBar = document.querySelector("#progress-bar");
	const recordingTime = document.querySelector("#recording-time");
	let selectElement;
	let selectedValue;
	let recorder;
	let chunks = [];
	let startTime;

	startRecording.addEventListener("click", () => {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			recorder = new MediaRecorder(stream);
			recorder.start();
			recordStatus.innerHTML = "Recording...";
			startRecording.disabled = true;
			stopRecording.disabled = false;
			chunks = [];
			startTime = new Date();
			recorder.addEventListener("dataavailable", (event) => {
				chunks.push(event.data);
			});
			recorder.addEventListener("stop", () => {
				const endTime = new Date();
				const duration = (endTime - startTime) / 1000;
				recordingTime.innerHTML = `Recording Duration: ${duration.toFixed(
					2
				)} seconds`;
				recordStatus.innerHTML =
					"Press submit, then please wait until you're being redirected";
			});
		});
	});

	stopRecording.addEventListener("click", () => {
		recorder.stop();
		recordStatus.innerHTML = "Finishing...";
		startRecording.disabled = false;
		stopRecording.disabled = true;
		const mediaStream = recorder.stream;
		mediaStream.getTracks().forEach((track) => track.stop());
	});

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		selectElement = document.getElementById("subject");
		selectedValue = selectElement.value;
		if (chunks.length > 0) {
			const audioBlob = new Blob(chunks);
			uploadAudioData(audioBlob, selectedValue);
		}
	});

	function uploadAudioData(audioBlob, subjectValue) {
		const formdata = new FormData();
		formdata.append("audio", audioBlob, "recording.wav");
		formdata.append("subject", subjectValue);

		const xhr = new XMLHttpRequest();
		xhr.open("POST", "/record", true);

		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable) {
				const percentComplete = (event.loaded / event.total) * 100;
				progressBar.style.width = `${percentComplete}%`;
			}
		};

		xhr.onload = () => {
			if (xhr.status === 200) {
				window.location.href = "/notes";
			} else {
				window.location.href = "/apology";
			}
		};

		xhr.send(formdata);
	}
	function getRecordingDuration() {
		const durationInSeconds = parseInt(recordingDurationInput.value, 10);
		return durationInSeconds * 1000; // Convert to milliseconds
	}
});
