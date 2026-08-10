'use client';

import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-3 px-6 glass-panel rounded-2xl border border-white/10 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500 shadow-sm shadow-emerald-500/30" />
        <span className="text-slate-300 font-medium">Tersedia (Available)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500 shadow-sm shadow-amber-500/30 animate-pulse" />
        <span className="text-slate-300 font-medium">Sedang Di-Lock (Held)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700 opacity-60 cursor-not-allowed" />
        <span className="text-slate-400 font-medium">Laku Terjual (Booked)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-indigo-600 border border-indigo-400 shadow-md shadow-indigo-500/50" />
        <span className="text-indigo-300 font-bold">Pilihan Anda</span>
      </div>
    </div>
  );
};
