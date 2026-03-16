import { useState } from 'react';
import LandingPage from './components/LandingPage.jsx';
import Tracker from './components/Tracker.jsx';

export default function App() {
  const [started, setStarted] = useState(false);
  const [mode,    setMode]    = useState('lines');

  return started
    ? <Tracker mode={mode} onModeChange={setMode} onHome={() => setStarted(false)} />
    : <LandingPage mode={mode} onModeChange={setMode} onStart={() => setStarted(true)} />;
}
