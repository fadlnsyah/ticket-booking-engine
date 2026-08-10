'use client';

import React, { useState } from 'react';
import { Ticket, Order } from '@/types/booking';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, X, Ticket as TicketIcon } from 'lucide-react';
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
        throw new Error(json.error || json.message || 'Pemesanan gagal. Kursi sudah dipilih oleh pembeli lain.');
      }

      setSuccessOrder(json.data);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!successOrder ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TicketIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Ringkasan Pemesanan</h3>
                <p className="text-xs text-slate-400">Pastikan rincian tiket Anda sudah benar</p>
              </div>
            </div>

            {/* Ticket Info Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Nama Acara</span>
                <span className="text-white font-medium">Coldplay Jakarta Flash Sale</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Nomor Kursi</span>
                <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {seat.seat_number}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Kategori</span>
                <span className="text-slate-300 font-medium">{seat.category}</span>
              </div>
              <div className="w-full h-[1px] bg-slate-800 my-2" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium">Total Tagihan</span>
                <span className="text-base font-bold text-emerald-400">
                  Rp {seat.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tiket dijamin 100% resmi & pemesanan instan.</span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                disabled={loading}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses Tiket...
                  </>
                ) : (
                  'Bayar & Ambil Tiket'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-3 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Pembelian Tiket Berhasil!</h3>
              <p className="text-xs text-slate-400 mt-1">
                E-Ticket resmi Anda telah diterbitkan.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-left text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Kode Transaksi:</span>
                <span className="font-mono text-indigo-400 font-bold">{successOrder.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Kursi:</span>
                <span className="font-bold text-white">{seat.seat_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Transaksi:</span>
                <span className="text-emerald-400 font-semibold">Terkonfirmasi</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
