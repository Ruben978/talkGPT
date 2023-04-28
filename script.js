// Audio Recorder - JavaScript

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
  new Promise(resolve => {
    mediaRecorder.addEventListener("stop", async () => {
      const audioBlob = new Blob(audioChunks);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.mp3');

      const response = await fetch('http://127.0.0.1:5000/upload-audio', {
        method: 'POST',
        body: formData
      });

      const audioUrl = await response.text();
      const audio = new Audio(audioUrl);

      const play = () => audio.play();
      resolve({ audioBlob, audioUrl, play });
    });

    mediaRecorder.stop();
  });

// Start & End Audio
async function startAudio() {
    const recorder = await recordAudio();
    recorder.start();

    document.getElementById("stop").addEventListener("click", async function() {
        const audio = await recorder.stop();
        audio.play();
    });
}