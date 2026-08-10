'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs">
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-slate-400 font-medium">Sisa Waktu Sales:</span>
      <div className="flex items-center gap-1 font-mono font-bold text-white">
        <span>{format(timeLeft.hours)}h</span>
        <span className="text-slate-600">:</span>
        <span>{format(timeLeft.minutes)}m</span>
        <span className="text-slate-600">:</span>
        <span className="text-amber-400">{format(timeLeft.seconds)}s</span>
      </div>
    </div>
  );
};
