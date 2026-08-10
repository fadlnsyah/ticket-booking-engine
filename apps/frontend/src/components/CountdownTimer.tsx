'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

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
    <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs tracking-wide uppercase">
        <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
        Flash Sale Ends In:
      </div>
      <div className="flex items-center gap-1 font-mono font-bold text-slate-100 text-sm">
        <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">{format(timeLeft.hours)}</span>
        <span>:</span>
        <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/10">{format(timeLeft.minutes)}</span>
        <span>:</span>
        <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-white/10 text-amber-400">{format(timeLeft.seconds)}</span>
      </div>
    </div>
  );
};
