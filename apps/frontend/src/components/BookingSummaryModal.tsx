'use client';

import React, { useState } from 'react';
import { Ticket, Order } from '@/types/booking';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingSummaryModalProps {
  seat: Ticket | null;
  onClose: () => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({ seat, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!seat) return null;

  const handleConfirmBooking = async () => {
    setLoading(true);
    setErrorMessage(null);

    const idempotencyKey = `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          event_id: seat.event_id,
          ticket_id: seat.id,
          idempotency_key: idempotencyKey,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || 'Pemesanan gagal. Silakan coba beberapa saat lagi.');
      }

      setSuccessOrder(json.data);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-[0] z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!successOrder ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Konfirmasi Pemesanan</h3>
                <p className="text-xs text-slate-400">Review tiket pilihan Anda sebelum diproses oleh Redis Lock</p>
              </div>
            </div>

            {/* Ticket Info Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Event</span>
                <span className="text-white font-semibold">Coldplay Jakarta Flash Sale</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Nomor Kursi</span>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                  {seat.seat_number}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Kategori</span>
                <span className="text-slate-200 font-medium">{seat.category}</span>
              </div>
              <div className="w-full h-[1px] bg-slate-800 my-2" />
              <div className="flex justify-between items-center text-base">
                <span className="text-slate-300 font-medium">Total Harga</span>
                <span className="text-lg font-bold text-emerald-400">
                  Rp {seat.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Proteksi System Badges */}
            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Redis Distributed Lock Active</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Idempotency Guarantee</span>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Memproses di Redis & RabbitMQ...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    Proses Beli Tiket
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Confirmation Screen */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Pemesanan Tiket Sukses!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Event pesanan Anda sedang dikonsumsi oleh RabbitMQ Background Worker.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 text-left text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono text-indigo-400 font-bold">{successOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kursi Dipesan:</span>
                <span className="font-bold text-white">{seat.seat_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Order:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  {successOrder.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Idempotency Key:</span>
                <span className="font-mono text-slate-400 text-[10px] truncate max-w-[200px]">
                  {successOrder.idempotency_key}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-colors"
            >
              Selesai & Kembali ke Denah
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
