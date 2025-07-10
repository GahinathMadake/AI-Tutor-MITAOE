import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  time: Date; 
  timer: { heading: string; subHeading: string };
  className?:string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ time, timer, className }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = new Date(time).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className={`min-w-[300px] bg-blue-50 p-6 rounded-lg shadow-md text-center ${className}`}>
      <h2 className="text-2xl font-bold text-blue-800 mb-4">{timer.heading}</h2>
      <p className="text-gray-600 mb-6">{timer.subHeading}</p>

      <div className="flex justify-center space-x-4">
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            <span className="text-3xl font-bold">{value}</span>
            <span className="block text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
