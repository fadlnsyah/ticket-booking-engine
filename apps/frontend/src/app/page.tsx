'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { CountdownTimer } from '@/components/CountdownTimer';
import { SeatLegend } from '@/components/SeatLegend';
import { SeatMapPicker } from '@/components/SeatMapPicker';
import { BookingSummaryModal } from '@/components/BookingSummaryModal';
import { Ticket } from '@/types/booking';
import { MapPin, Calendar, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function Home() {
  const [selectedSeat, setSelectedSeat] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Minimalist Concert Banner Hero */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Banner Image */}
            <div className="md:col-span-5 relative h-56 md:h-auto min-h-[220px]">
              <Image
                src="/concert-banner.png"
                alt="Coldplay Concert Banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900" />
            </div>

            {/* Event Info Details */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold tracking-wide uppercase">
                    Konser Musik Resmi
                  </span>
                  <CountdownTimer />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  Coldplay: Music of the Spheres World Tour
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Sabtu, 15 November 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stadion Gelora Bung Karno, Jakarta</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Harga Tiket Mulai: <strong className="text-white">Rp 1.200.000</strong></span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Garansi Tiket Asli
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Legend */}
        <SeatLegend />

        {/* Seat Selector Grid & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Seat Grid */}
          <div className="lg:col-span-8">
            <SeatMapPicker
              selectedSeat={selectedSeat}
              onSelectSeat={(seat) => setSelectedSeat(seat)}
            />
          </div>

          {/* Checkout Action Drawer */}
          <div className="lg:col-span-4 bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 space-y-6 sticky top-20">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Ringkasan Kursi
            </h3>

            {selectedSeat ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Kategori Kursi</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[11px] font-bold border border-indigo-500/20">
                      {selectedSeat.category}
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-white tracking-wide">
                    {selectedSeat.seat_number}
                  </div>
                  <div className="w-full h-[1px] bg-slate-800" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Harga Tiket</span>
                    <span className="text-base font-bold text-emerald-400">
                      Rp {selectedSeat.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  Lanjut ke Pemesanan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2 text-slate-400 text-xs">
                <p>Silakan klik salah satu kursi berwarna <strong className="text-emerald-400">Hijau</strong> di sebelah kiri untuk memilih tiket Anda.</p>
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
      <footer className="mt-16 border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>TIXPAS Official Event Ticketing Platform &copy; 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}
