import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [status, setStatus] = useState('waiting'); // 'waiting', 'running', 'ended'

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      
      // Kiểm tra xem flash sale đã bắt đầu chưa
      if (now < startTime) {
        setStatus('waiting');
        const distance = startTime - now;
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
        return;
      }

      // Kiểm tra xem flash sale đã kết thúc chưa
      if (now > endTime) {
        clearInterval(timer);
        setStatus('ended');
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Flash sale đang diễn ra
      setStatus('running');
      const distance = endTime - now;
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return 'Bắt đầu sau:';
      case 'running':
        return 'Kết thúc sau:';
      case 'ended':
        return 'Đã kết thúc';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-red-600 font-medium">{getStatusText()}</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded">
        <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded">
        <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
      </div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded">
        <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
