import { useRef } from 'react';
import Canvas from './Canvas.jsx';
import StatusBar from './StatusBar.jsx';
import ModeSelector from './ModeSelector.jsx';
import { useDetector } from '../hooks/useDetector.js';

export default function Tracker({ mode, onModeChange, onHome }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const { status } = useDetector(videoRef, canvasRef, mode);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline />
      <Canvas ref={canvasRef} />
      <button className="home-btn" onClick={onHome}>
        ← Home
      </button>
      <ModeSelector mode={mode} onModeChange={onModeChange} />
      <StatusBar state={status.state} text={status.text} />
    </>
  );
}
