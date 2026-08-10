'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CountdownTimer } from '@/components/CountdownTimer';
import { SeatLegend } from '@/components/SeatLegend';
import { SeatMapPicker } from '@/components/SeatMapPicker';
import { BookingSummaryModal } from '@/components/BookingSummaryModal';
import { Ticket } from '@/types/booking';
import { MapPin, Calendar, Music, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [selectedSeat, setSelectedSeat] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 relative overflow-hidden">
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 z-10">
        
        {/* Concert Hero Header Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-white/10 glow-primary">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  WORLD TOUR 2026
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold tracking-wider">
                  FLASH SALE ACTIVE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Coldplay: Music of the Spheres <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
                  Live in Jakarta (Flash Sale)
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Sabtu, 15 November 2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Gelora Bung Karno Stadium, Jakarta</span>
                </div>
              </div>
            </div>

            {/* Countdown Component */}
            <div className="flex flex-col items-start lg:items-end gap-3">
              <CountdownTimer />
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Diproteksi oleh Redis Mutex & Optimistic OCC DB
              </p>
            </div>
          </div>
        </div>

        {/* Legend Indicator */}
        <SeatLegend />

        {/* Interactive Seat Picker & Booking Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Seat Map Grid (8 Cols) */}
          <div className="lg:col-span-8">
            <SeatMapPicker
              selectedSeat={selectedSeat}
              onSelectSeat={(seat) => setSelectedSeat(seat)}
            />
          </div>

          {/* Booking Action Sidebar (4 Cols) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-white flex items-center justify-between border-b border-white/10 pb-4">
              <span>Ringkasan Kursi</span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </h3>

            {selectedSeat ? (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="bg-slate-900/90 border border-indigo-500/30 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Kursi Dipilih</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                      {selectedSeat.category}
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-white tracking-wider">
                    {selectedSeat.seat_number}
                  </div>
                  <div className="w-full h-[1px] bg-slate-800" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Harga Tiket</span>
                    <span className="text-lg font-bold text-emerald-400">
                      Rp {selectedSeat.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                  Lanjut ke Pemesanan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <Music className="w-6 h-6" />
                </div>
                <p className="text-xs">
                  Silakan klik salah satu kursi berwarna <span className="text-emerald-400 font-semibold">Hijau</span> pada denah di samping untuk melanjutkan.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Confirmation Modal */}
      {isModalOpen && selectedSeat && (
        <BookingSummaryModal
          seat={selectedSeat}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSeat(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5 py-6 text-center text-xs text-slate-500">
        <p>TicketPulse Flash Sale Engine &copy; 2026. Built with Go 1.22, Redis Redlock, RabbitMQ, and Next.js 14.</p>
      </footer>
    </div>
  );
}
