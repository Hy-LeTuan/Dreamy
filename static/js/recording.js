"use strict";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("form");
	const startRecording = document.querySelector("#start-recording");
	const stopRecording = document.querySelector("#stop-recording");
	const recordStatus = document.querySelector("#record-status");
	let selectElement;
	let selectedValue;

	let recorder;
	let chunks = [];

	startRecording.addEventListener("click", () => {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			recorder = new MediaRecorder(stream);
			recorder.start();
			recordStatus.innerHTML = "Recording...";
			startRecording.disabled = true;
			stopRecording.disabled = false;
			chunks = [];
			recorder.addEventListener("dataavailable", (event) => {
				chunks.push(event.data);
			});
			recorder.addEventListener("stop", () => {
				recordStatus.innerHTML = "";
				// const audioBlob = new Blob(chunks);
				// sendAudioData(audioBlob);
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
		event.preventDefault(); // Prevent form submission

		selectElement = document.getElementById("subject_option");
		selectedValue = selectElement.value;
		if (chunks.length > 0) {
			const audioBlob = new Blob(chunks);
			sendAudioData(audioBlob, selectedValue);
		}
	});

	function sendAudioData(audioBlob, subject_value) {
		const formdata = new FormData();
		formdata.append("audio", audioBlob, "recording.wav");
		formdata.append("subject", subject_value);
		fetch("/audio", {
			method: "POST",
			body: formdata,
			mode: "no-cors",
		});
	}
});
