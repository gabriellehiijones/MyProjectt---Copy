import React, { useState, useRef } from 'react';

const Video = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState('');

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      setVideoURL(videoURL);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const uploadVideo = async () => {
    const formData = new FormData();
    formData.append('video', await fetch(videoURL).then((res) => res.blob()), 'recording.webm');

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <h1>React Video Selfie Recording</h1>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <>
          <button onClick={startRecording}>Start Recording</button>
          {videoURL && <button onClick={uploadVideo}>Upload Video</button>}
        </>
      )}
      {videoURL && (
        <div>
          <p>Video Recording:</p>
          <video controls width="640" height="480" src={videoURL}></video>
        </div>
      )}
    </div>
  );
};

export default Video;
