'use client';

import React, { useState } from 'react';
import { Ticket } from '@/types/booking';
import { Armchair } from 'lucide-react';

interface SeatMapPickerProps {
  selectedSeat: Ticket | null;
  onSelectSeat: (seat: Ticket) => void;
}

const generateMockSeats = (): Ticket[] => {
  const categories: ('VIP' | 'CAT 1' | 'CAT 2')[] = ['VIP', 'CAT 1', 'CAT 2'];
  const seats: Ticket[] = [];
  const eventId = '22222222-2222-2222-2222-222222222222';

  let seatIndex = 1;
  categories.forEach((cat) => {
    const price = cat === 'VIP' ? 2500000 : cat === 'CAT 1' ? 1800000 : 1200000;
    const count = 16;
    for (let i = 1; i <= count; i++) {
      const isHeld = seatIndex === 5 || seatIndex === 14;
      const isBooked = seatIndex === 8 || seatIndex === 12 || seatIndex === 22 || seatIndex === 30;
      
      const uuidSuffix = seatIndex.toString().padStart(12, '0');
      const validTicketUuid = `11111111-1111-1111-1111-${uuidSuffix}`;
      
      seats.push({
        id: validTicketUuid,
        event_id: eventId,
        seat_number: `SEAT-A-${seatIndex.toString().padStart(4, '0')}`,
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
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 sm:p-8 space-y-8">
      {/* Minimalist Stage Line */}
      <div className="relative w-full py-3 text-center">
        <div className="w-2/3 mx-auto h-8 bg-slate-800/60 border-t border-slate-600 rounded-t-full flex items-center justify-center">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
            PANGGUNG UTAMA / STAGE
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex justify-center gap-2">
        {(['ALL', 'VIP', 'CAT 1', 'CAT 2'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'Semua Kursi' : cat}
          </button>
        ))}
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-2xl mx-auto p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
        {filteredSeats.map((seat) => {
          const isSelected = selectedSeat?.id === seat.id;
          const isAvailable = seat.status === 'AVAILABLE';
          const isHeld = seat.status === 'HELD';
          const isBooked = seat.status === 'BOOKED';

          let statusClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/20';
          if (isHeld) {
            statusClass = 'bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-not-allowed opacity-75';
          } else if (isBooked) {
            statusClass = 'bg-slate-900 border-slate-850 text-slate-700 cursor-not-allowed opacity-35';
          }

          if (isSelected) {
            statusClass = 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30 scale-105';
          }

          return (
            <button
              key={seat.id}
              disabled={!isAvailable}
              onClick={() => onSelectSeat(seat)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all ${statusClass}`}
            >
              <Armchair className="w-4 h-4 mb-1" />
              <span className="text-[10px] font-mono font-medium">
                {seat.seat_number.replace('SEAT-A-', '')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
