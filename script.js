document.addEventListener('DOMContentLoaded', () => {
    const chatDiv = document.getElementById('chat');
    const recordButton = document.getElementById('record');
    const stopButton = document.getElementById('stop');
    const playButton = document.getElementById('play');
    let recordedChunks = [];
  
    function addToChat(message) {
      const p = document.createElement('p');
      p.textContent = message;
      chatDiv.appendChild(p);
    }
  
    let mediaRecorder;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    playButton.addEventListener('click', playRecording);
  
    function startRecording() {
      recordedChunks = [];
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              recordedChunks.push(e.data);
            }
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            addToChat('Audio recorded');
            addToChat(`<audio controls src="${audioUrl}"></audio>`);
          };
          mediaRecorder.start();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    }
  
    function stopRecording() {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        addToChat('Recording stopped');
      } else {
        addToChat('No recording to stop');
      }
    }
  
    function playRecording() {
      if (recordedChunks.length > 0) {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        addToChat('No audio to play');
      }
    }
  });
  document.getElementById('toggleMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
  });
    