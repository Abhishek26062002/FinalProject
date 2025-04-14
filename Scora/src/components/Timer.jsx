// Timer.js
import React, { useState, useEffect } from "react";

const Timer = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) return;
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  // Convert seconds to mm:ss format
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer">
      {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </div>
  );
};

export default Timer;
