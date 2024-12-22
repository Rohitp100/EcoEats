// client/src/components/scanner.js
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CameraCapture.css';
import LOGO from '../components/logo.png';

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrResult, setOcrResult] = useState('');
  const [capturedImage, setCapturedImage] = useState('');
  const navigate = useNavigate(); 

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => console.error('Error accessing camera:', err));
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    setCapturedImage(imageData);
  };

  const inspectImage = () => {
    if (!capturedImage) return;
    axios.post('http://localhost:5008/ocr', { image: capturedImage })
      .then(response => {
        setOcrResult(response.data.text);
      })
      .catch(err => console.error('Error processing image:', err));
  };

  const handleOK = () => {
    if (!ocrResult) return;
    navigate('/', { state: { ocrResult } }); // Navigate back to Home with OCR results
  };

  const handleLOGO = () => {
    navigate('/');
  };

  return (
    <div 
    className="camera-container">
      <header className="w-full mb-5 p-4 text-green-700 bg-green-200 bg-opacity-50 text-center">
        <button onClick={handleLOGO}>
        <img src={LOGO} alt="EcoEats Logo" className="mx-auto h-16 border-none" />
        </button>
        
      </header>
      <video ref={videoRef} width="640" height="480" />
      <button className="btn" onClick={startCamera}>Start Camera</button>
      <button className="btn" onClick={capturePhoto}>Capture</button>
      <button className="btn" onClick={inspectImage} disabled={!capturedImage}>Inspect</button>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
      {capturedImage && <img src={capturedImage} alt="Captured" />}
      <div className="ocr-result">
      <h3 className="text-green-600">OCR Result:</h3>
        <p>{ocrResult}</p>
        <button className='btn' onClick={handleOK}>OK</button>
      </div>
    </div>
  );
};

export default CameraCapture;
