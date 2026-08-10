'use client';

import React from 'react';

export const SeatLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-3 px-6 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500" />
        <span className="text-slate-300 font-medium">Tersedia</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500" />
        <span className="text-slate-300 font-medium">Sedang Diproses</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700 opacity-50" />
        <span className="text-slate-400 font-medium">Terjual</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-400" />
        <span className="text-indigo-300 font-semibold">Pilihan Anda</span>
      </div>
    </div>
  );
};
