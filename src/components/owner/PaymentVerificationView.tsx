import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileImage,
  ExternalLink,
  Eye,
  CreditCard,
  Building2,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { Payment } from '../../types';

export const PaymentVerificationView: React.FC = () => {
  const { payments, approvePayment, rejectPayment, setSelectedReceipt } = useApp();
  const [selectedProofPayment, setSelectedProofPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [activePaymentToReject, setActivePaymentToReject] = useState<Payment | null>(null);

  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const pastVerifiedPayments = payments.filter(p => p.status !== 'PENDING');

  const handleOpenReject = (payment: Payment) => {
    setActivePaymentToReject(payment);
    setRejectionReason('Reference number does not match GCash transaction record.');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (activePaymentToReject) {
      rejectPayment(activePaymentToReject.id, rejectionReason);
      setIsRejectModalOpen(false);
      setActivePaymentToReject(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Payment Verification Inbox
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-mono">
              {pendingPayments.length} Pending
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review uploaded GCash, Maya, and online bank receipts. Approving automatically clears invoices and generates stamped electronic receipts.
          </p>
        </div>
      </div>

      {/* PENDING VERIFICATION CARDS */}
      {pendingPayments.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All Payments Verified!"
          description="There are no pending GCash or Maya transactions awaiting owner approval. All tenant ledgers are currently up to date."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingPayments.map(payment => (
            <div
              key={payment.id}
              className="rounded-2xl bg-[#101F23] border border-amber-500/30 shadow-xl overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 bg-gradient-to-r from-amber-950/30 via-[#101F23] to-[#101F23] border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Payment Verification Required
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">
                    {payment.tenantName}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Room Assignment</div>
                  <span className="text-sm font-bold text-teal-300 font-mono">
                    Room {payment.roomNumber}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 text-xs">
                {/* Amount & Method Banner */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.06]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Amount Sent</span>
                    <div className="text-xl font-extrabold text-teal-300 font-mono mt-0.5">
                      {formatPHP(payment.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {payment.type === 'RENT_UTILITIES' ? 'Rent + Utility Surcharge' : payment.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Channel & Ref</span>
                    <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px]">
                        {payment.method}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 font-bold block mt-1">
                      {payment.referenceNumber}
                    </span>
                  </div>
                </div>

                {/* Proof Screenshot Preview */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <FileImage className="w-3.5 h-3.5 text-teal-400" />
                      Uploaded Payment Proof
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{formatDate(payment.date)}</span>
                  </div>
                  
                  {payment.proofImageUrl ? (
                    <div
                      onClick={() => setSelectedProofPayment(payment)}
                      className="relative h-44 rounded-xl overflow-hidden border border-white/[0.08] bg-black/40 group cursor-pointer"
                    >
                      <img
                        src={payment.proofImageUrl}
                        alt="Payment Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-slate-100 text-xs font-semibold transition-opacity">
                        <Eye className="w-4 h-4 text-teal-400" /> Click to Zoom Full Image
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-slate-400">
                      No image attached (Cash/Direct Transfer)
                    </div>
                  )}
                </div>

                {payment.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                    Tenant remark: "{payment.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-5 border-t border-white/[0.06] bg-[#071014] flex items-center justify-end gap-3">
                <button
                  onClick={() => handleOpenReject(payment)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                >
                  <XCircle className="w-4 h-4" /> Reject Payment
                </button>
                <button
                  onClick={() => approvePayment(payment.id)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Payment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAST VERIFIED & REJECTED HISTORY TABLE */}
      <div className="rounded-2xl bg-[#101F23] border border-white/[0.06] p-5 sm:p-6 shadow-xl mt-8">
        <h3 className="text-base font-bold text-slate-100 mb-1">Payment Verification History</h3>
        <p className="text-xs text-slate-400 mb-4">
          All approved and archived payment proofs with digital verification timestamps.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Receipt No</th>
                <th className="py-3 px-3">Tenant & Room</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Method & Reference</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-200">
              {pastVerifiedPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    {payment.receiptNumber}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-100 block">{payment.tenantName}</span>
                    <span className="text-[11px] text-teal-300 font-mono">Room {payment.roomNumber}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-teal-300">
                    {formatPHP(payment.amount)}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-slate-200">{payment.method}</span>
                    <span className="text-[10px] text-slate-400 block">{payment.referenceNumber}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {formatDate(payment.date)}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge type="payment" status={payment.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(payment)}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 border border-teal-500/30 text-[11px] font-semibold"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL IMAGE PROOF ZOOM MODAL */}
      {selectedProofPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-100">
          <div className="relative max-w-2xl w-full rounded-2xl bg-[#0B171B] border border-teal-500/30 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-100">
                  {selectedProofPayment.tenantName} — Proof of Payment
                </h4>
                <p className="text-xs text-teal-300 font-mono">
                  {selectedProofPayment.method} • Ref: {selectedProofPayment.referenceNumber} • {formatPHP(selectedProofPayment.amount)}
                </p>
              </div>
              <button
                onClick={() => setSelectedProofPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto rounded-xl border border-white/[0.08] bg-black flex items-center justify-center p-2">
              <img
                src={selectedProofPayment.proofImageUrl}
                alt="Full Proof"
                className="max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400 font-mono">Status: {selectedProofPayment.status}</span>
              <button
                onClick={() => setSelectedProofPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] text-slate-200 hover:bg-white/[0.12]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {isRejectModalOpen && activePaymentToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-md rounded-2xl bg-[#0B171B] border border-rose-500/30 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-100">Reject Payment Proof</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Notify <span className="font-bold text-slate-100">{activePaymentToReject.tenantName}</span> (Room {activePaymentToReject.roomNumber}) why their payment was rejected so they can resubmit.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reason for Rejection *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#101F23] border border-white/[0.08] text-xs text-slate-100 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.06] hover:bg-white/[0.1]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Send Rejection Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
