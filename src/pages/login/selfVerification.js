import React, { useState } from 'react';
import Link from 'next/link';
import '../../styles/globals.css';

export default function SelfVerification() {
  const [isClient, setIsClient] = useState(false);
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [cameraPhoto, setCameraPhoto] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Toggle camera on/off
  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  // Handle file uploads for NID Front and Back
  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (type === 'front') {
      setFrontPhoto(URL.createObjectURL(file));
    } else if (type === 'back') {
      setBackPhoto(URL.createObjectURL(file));
    }
  };

  // Capture image from the camera
  const captureImage = (event) => {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL();
    setCameraPhoto(dataUrl);
  };

  // Start camera for real-time capture
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = document.getElementById('video');
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.log("Error accessing camera:", err);
        });
    }
  };

  // Start the camera when the page loads
  React.useEffect(() => {
    if (isCameraOn) {
      startCamera();
    }
  }, [isCameraOn]);

  return (
    <div className="container">
      {/* Left Panel */}
      <section className="left-panel">
        <img src="/assets/logo.png" alt="MEDIRIDE Logo" className="logo" />
        <p className="tagline">
          আপনার প্রয়োজন, আমাদের অগ্রাধিকার, যে কোন সময়, কোথাও, প্রস্তুত
        </p>
        <button className="primary-btn">
          <img src="/assets/call-icon.png" alt="Call Icon" className="icon" />
          কল করুন
        </button>
      </section>

      {/* Right Panel - Self Verification Form */}
      <section className="right-panel">
        <div className="verification-header">
          <h1 className="verification-title">নাম</h1>
          <h2 className="verification-subtitle">আপনার নাম</h2>
        </div>

        <form className="verification-form">
          <div className="form-group">
            <label>আপনার নাম লিখুন</label>
            <input type="text" placeholder="আপনার নাম লিখুন" required />
          </div>

          <div className="form-group">
            <label>জাতীয় পরিচয়পত্র (NID) ফটোগ্রাফ</label>
            <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'front')} />
            {frontPhoto && <img src={frontPhoto} alt="NID Front" className="nid-photo" />}
            <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'back')} />
            {backPhoto && <img src={backPhoto} alt="NID Back" className="nid-photo" />}
          </div>

          <div className="form-group">
            <label>ক্যামেরা দিয়ে যাচাই</label>
            <button type="button" onClick={toggleCamera} className="secondary-btn">
              {isCameraOn ? 'ক্যামেরা বন্ধ করুন' : 'ক্যামেরা চালু করুন'}
            </button>
            {isCameraOn && (
              <div className="camera-container">
                <video id="video" width="100%" height="auto" />
                <button type="button" onClick={captureImage} className="secondary-btn">
                  ছবি তুলুন
                </button>
                {cameraPhoto && <img src={cameraPhoto} alt="Captured" className="captured-photo" />}
              </div>
            )}
          </div>

          <button type="submit" className="secondary-btn verification-btn">
            স্বীকৃত করুন
          </button>

          <div className="verification-info">
            <p>নিজেকে ভেরিফাই করুন</p>
            <ul>
              <li>জাতীয় পরিচয়পত্র বা সর্ম্পকিত ছবি বা নম্বর দিন</li>
              <li>আপনার ফোন নম্বর আবার পূর্ণ করুন</li>
            </ul>
          </div>
        </form>

        {/* Home Button */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/" passHref legacyBehavior>
            <a className="secondary-btn back-home-btn">← হোমে ফিরে যান</a>
          </Link>
        </div>
      </section>
    </div>
  );
}
