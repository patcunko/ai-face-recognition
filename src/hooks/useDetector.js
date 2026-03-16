/* global Holistic, Camera */
import { useEffect, useRef, useState } from 'react';
import { render } from '../lib/renderer.js';
import { processThumbsUp } from '../lib/effects/thumbsUp.js';

const INITIAL_STATUS = { state: 'loading', text: 'Loading model...' };

export function useDetector(videoRef, canvasRef, mode) {
  const [status, setStatus] = useState(INITIAL_STATUS);
  const holisticRef = useRef(null);
  const modeRef     = useRef(mode);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    function onResults(results) {
      const hasFace = results.faceLandmarks?.length > 0;
      const hasBody = results.poseLandmarks?.length > 0;

      if (!hasFace && !hasBody) {
        setStatus({ state: 'waiting', text: 'No person detected' });
        return;
      }

      setStatus({ state: 'tracking', text: 'Tracking' });
      processThumbsUp(results.leftHandLandmarks, results.rightHandLandmarks);
      render(canvas, results, modeRef.current);
    }

    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity:        1,
      smoothLandmarks:        true,
      enableSegmentation:     false,
      refineFaceLandmarks:    true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence:  0.5,
    });

    holistic.onResults(onResults);
    holisticRef.current = holistic;

    const camera = new Camera(video, {
      onFrame: async () => holistic.send({ image: video }),
      width:   1280,
      height:  720,
    });

    camera.start()
      .then(() => setStatus({ state: 'loading', text: 'Warming up...' }))
      .catch((err) => {
        setStatus({ state: 'waiting', text: 'Camera error' });
        console.error(err);
      });

    return () => { holistic.close(); };
  }, []);

  return { status };
}
