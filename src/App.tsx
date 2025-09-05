import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

const App: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isPaused: false
  });

  const [inputMinutes, setInputMinutes] = useState<number>(25);
  const [volume, setVolume] = useState<number>(0.5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished - restart automatically
            playSound();
            return { 
              ...prev, 
              minutes: inputMinutes, 
              seconds: 0, 
              isRunning: true, 
              isPaused: false 
            };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.isPaused, inputMinutes]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const startTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetTimer = () => {
    setTimer({
      minutes: inputMinutes,
      seconds: 0,
      isRunning: false,
      isPaused: false
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const setCustomTime = () => {
    if (inputMinutes > 0 && inputMinutes <= 999) {
      setTimer({
        minutes: inputMinutes,
        seconds: 0,
        isRunning: false,
        isPaused: false
      });
    }
  };

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = inputMinutes * 60;
    const remainingSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="app-container">
      <div className="text-center">
        <h1 className="text-white mb-5 display-4 fw-bold">Timer Boss</h1>
        
        <div className="card bg-dark border-light timer-card">
          <div className="card-body p-4">
            {/* Timer Display */}
            <div className="mb-4">
              <div className="position-relative d-inline-block">
                <svg width="200" height="200" className="mb-3">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#333"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#007bff"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <h2 className="text-white display-3 fw-bold mb-0">
                    {formatTime(timer.minutes, timer.seconds)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mb-4">
              <div className="btn-group" role="group">
                {!timer.isRunning ? (
                  <button
                    className="btn btn-success btn-lg px-4"
                    onClick={startTimer}
                  >
                    <i className="bi bi-play-fill me-2"></i>Start
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-lg px-4"
                    onClick={pauseTimer}
                  >
                    <i className="bi bi-pause-fill me-2"></i>
                    {timer.isPaused ? 'Resume' : 'Pause'}
                  </button>
                )}
                <button
                  className="btn btn-danger btn-lg px-4"
                  onClick={resetTimer}
                >
                  <i className="bi bi-stop-fill me-2"></i>Reset
                </button>
              </div>
            </div>

            {/* Custom Time Input */}
            <div className="mb-3">
              <label htmlFor="customMinutes" className="form-label text-white">
                Set Custom Time (minutes):
              </label>
              <div className="input-group">
                <input
                  type="number"
                  id="customMinutes"
                  className="form-control"
                  min="1"
                  max="999"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(parseInt(e.target.value) || 0)}
                />
                <button
                  className="btn btn-outline-primary"
                  onClick={setCustomTime}
                  disabled={timer.isRunning}
                >
                  Set
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="mb-3">
              <label htmlFor="volumeSlider" className="form-label text-white">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                id="volumeSlider"
                className="form-range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              />
            </div>

            {/* Quick Presets */}
            <div className="mb-3">
              <div className="btn-group" role="group">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setInputMinutes(5);
                    setTimer({
                      minutes: 5,
                      seconds: 0,
                      isRunning: false,
                      isPaused: false
                    });
                  }}
                >
                  5min
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setInputMinutes(10);
                    setTimer({
                      minutes: 10,
                      seconds: 0,
                      isRunning: false,
                      isPaused: false
                    });
                  }}
                >
                  10min
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setInputMinutes(20);
                    setTimer({
                      minutes: 20,
                      seconds: 0,
                      isRunning: false,
                      isPaused: false
                    });
                  }}
                >
                  20min
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setInputMinutes(30);
                    setTimer({
                      minutes: 30,
                      seconds: 0,
                      isRunning: false,
                      isPaused: false
                    });
                  }}
                >
                  30min
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audio element for notifications */}
        <audio ref={audioRef} preload="auto">
          <source src="/notification.mp3" type="audio/mpeg" />
          <source src="/notification.wav" type="audio/wav" />
          <source src="/notification.ogg" type="audio/ogg" />
        </audio>
      </div>
    </div>
  );
};

export default App;