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
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = audioUrl;
          a.download = "Audio Recorder.mp3";
          document.body.appendChild(a);
          a.click();
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
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