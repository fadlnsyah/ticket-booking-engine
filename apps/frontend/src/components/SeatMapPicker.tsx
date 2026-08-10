'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types/booking';
import { Sparkles, Armchair } from 'lucide-react';

interface SeatMapPickerProps {
  selectedSeat: Ticket | null;
  onSelectSeat: (seat: Ticket) => void;
}

// Generate 48 seats layout
const generateMockSeats = (): Ticket[] => {
  const categories: ('VIP' | 'CAT 1' | 'CAT 2')[] = ['VIP', 'CAT 1', 'CAT 2'];
  const seats: Ticket[] = [];
  const eventId = '22222222-2222-2222-2222-222222222222';
  const firstTicketId = '11111111-1111-1111-1111-111111111111';

  let seatIndex = 1;
  categories.forEach((cat, catIdx) => {
    const price = cat === 'VIP' ? 2500000 : cat === 'CAT 1' ? 1800000 : 1200000;
    const count = 16;
    for (let i = 1; i <= count; i++) {
      const isFirst = seatIndex === 1;
      const isHeld = seatIndex === 5 || seatIndex === 14;
      const isBooked = seatIndex === 8 || seatIndex === 12 || seatIndex === 22 || seatIndex === 30;
      
      seats.push({
        id: isFirst ? firstTicketId : `ticket-${seatIndex}`,
        event_id: eventId,
        seat_number: `SEAT-${cat.charAt(0)}-${i.toString().padStart(4, '0')}`,
        price: price,
        status: isBooked ? 'BOOKED' : isHeld ? 'HELD' : 'AVAILABLE',
        category: cat,
      });
      seatIndex++;
    }
  });

  return seats;
};

export const SeatMapPicker: React.FC<SeatMapPickerProps> = ({ selectedSeat, onSelectSeat }) => {
  const [seats] = useState<Ticket[]>(generateMockSeats);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'VIP' | 'CAT 1' | 'CAT 2'>('ALL');

  const filteredSeats = activeCategory === 'ALL' 
    ? seats 
    : seats.filter((s) => s.category === activeCategory);

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 space-y-8">
      {/* Concert Stage Layout Banner */}
      <div className="relative w-full py-4 text-center">
        <div className="w-3/4 mx-auto h-12 bg-gradient-to-b from-indigo-500/20 to-transparent border-t-2 border-indigo-500/50 rounded-t-[50%] flex items-center justify-center">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            STAGELIGHTS & MAIN CONCERT STAGE
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </span>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mt-2" />
      </div>

      {/* Category Tabs Filter */}
      <div className="flex justify-center gap-2">
        {(['ALL', 'VIP', 'CAT 1', 'CAT 2'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
            }`}
          >
            {cat === 'ALL' ? 'Semua Kursi' : cat}
          </button>
        ))}
      </div>

      {/* Interactive Seat Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 max-w-3xl mx-auto p-4 bg-slate-950/40 rounded-2xl border border-white/5">
        {filteredSeats.map((seat) => {
          const isSelected = selectedSeat?.id === seat.id;
          const isAvailable = seat.status === 'AVAILABLE';
          const isHeld = seat.status === 'HELD';
          const isBooked = seat.status === 'BOOKED';

          let statusClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/20';
          if (isHeld) {
            statusClass = 'bg-amber-500/15 border-amber-500/40 text-amber-400 cursor-not-allowed opacity-80 animate-pulse';
          } else if (isBooked) {
            statusClass = 'bg-slate-850 border-slate-800 text-slate-600 cursor-not-allowed opacity-40';
          }

          if (isSelected) {
            statusClass = 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/50 scale-110 ring-2 ring-indigo-400/50';
          }

          return (
            <button
              key={seat.id}
              disabled={!isAvailable}
              onClick={() => onSelectSeat(seat)}
              className={`relative group p-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${statusClass}`}
            >
              <Armchair className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-mono font-bold tracking-tighter">
                {seat.seat_number.replace('SEAT-', '')}
              </span>

              {/* Tooltip Hover Info */}
              {isAvailable && !isSelected && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] text-slate-200 whitespace-nowrap z-20 shadow-xl">
                  <span className="font-semibold">{seat.category}</span>
                  <span className="text-emerald-400">Rp {seat.price.toLocaleString('id-ID')}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
