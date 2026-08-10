'use client';

import React from 'react';
import { Ticket, Search, User, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/60 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              TIX<span className="text-indigo-400">PAS</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#" className="text-white font-semibold hover:text-indigo-400 transition-colors">Konser Musik</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Festival</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Olahraga</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Bantuan</a>
        </nav>

        {/* Search & User Badge */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs w-48 lg:w-64">
            <Search className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Cari konser atau artis..."
              className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Partner Resmi</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
