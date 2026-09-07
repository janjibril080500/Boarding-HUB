import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Share2, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP, formatDate } from '../../utils/formatters';
import { Logo } from './Logo';

export const DigitalReceiptModal: React.FC = () => {
  const { selectedReceipt, setSelectedReceipt, property } = useApp();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate a printable/text friendly download representation
    const receiptContent = `
========================================
           BOARDINGHUB (PH)
      OFFICIAL PAYMENT ACKNOWLEDGEMENT
========================================
Receipt No:     ${selectedReceipt.receiptNumber}
Date Issued:    ${selectedReceipt.date}
Property:       ${property?.name || 'Boarding House'}
Address:        ${property?.address || 'Acacia Street'}, ${property?.city || 'Davao City'}
Contact:        ${property?.contactNumber || 'N/A'}

TENANT INFORMATION:
Name:           ${selectedReceipt.tenantName}
Room Assigned:  Room ${selectedReceipt.roomNumber}
Period Covered: ${selectedReceipt.forMonth}

BREAKDOWN OF CHARGES:
- Room Rent:        ${formatPHP(selectedReceipt.rentAmount || selectedReceipt.amount)}
- Electricity:      ${formatPHP(selectedReceipt.electricityAmount || 0)}
- Water Utility:    ${formatPHP(selectedReceipt.waterAmount || 0)}
- Wi-Fi/Others:     ${formatPHP(selectedReceipt.wifiAmount || selectedReceipt.otherAmount || 0)}
----------------------------------------
TOTAL AMOUNT PAID:  ${formatPHP(selectedReceipt.amount)}
----------------------------------------
Payment Channel:    ${selectedReceipt.method}
Reference Number:   ${selectedReceipt.referenceNumber}
Status:             VERIFIED & PAID (${selectedReceipt.status})
Verified By:        Property Admin (${selectedReceipt.verifiedAt || selectedReceipt.date})

Thank you for your prompt payment!
Powered by BoardingHub Philippines.
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${selectedReceipt.receiptNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0B171B] border border-teal-500/30 shadow-2xl shadow-teal-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#071014] no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <h3 className="text-sm font-bold text-slate-100">Digital Official Receipt</h3>
          </div>
          <button
            onClick={() => setSelectedReceipt(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-100" ref={receiptRef}>
          {/* Header Branding */}
          <div className="flex justify-between items-start pb-4 border-b border-white/[0.1]">
            <div>
              <Logo size="sm" />
              <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-tight">
                Ref: {selectedReceipt.receiptNumber}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 border border-teal-500/40 text-teal-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PAID & RECORDED
              </span>
              <p className="text-xs text-slate-400 mt-1">{formatDate(selectedReceipt.date)}</p>
            </div>
          </div>

          {/* Property & Tenant Meta Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#101F23] border border-white/[0.06] text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Issued By</span>
              <p className="font-bold text-slate-200 mt-0.5">{property?.name || 'Boarding House'}</p>
              <p className="text-slate-400 text-[11px]">{property?.address || 'Acacia St'}, {property?.city || 'Davao City'}</p>
              <p className="text-slate-400 text-[11px]">{property?.contactNumber || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Issued To</span>
              <p className="font-bold text-slate-200 mt-0.5">{selectedReceipt.tenantName}</p>
              <p className="text-teal-300 font-medium text-[11px]">Room {selectedReceipt.roomNumber}</p>
              <p className="text-slate-400 text-[11px]">For: {selectedReceipt.forMonth}</p>
            </div>
          </div>

          {/* Line Items Breakdown */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Payment Breakdown
            </div>
            <div className="rounded-xl bg-[#101F23] border border-white/[0.06] overflow-hidden text-xs">
              <div className="flex justify-between p-3 border-b border-white/[0.04]">
                <span className="text-slate-300 font-medium">Room Accommodation Rent</span>
                <span className="font-semibold text-slate-100 font-mono">
                  {formatPHP(selectedReceipt.rentAmount || selectedReceipt.amount)}
                </span>
              </div>

              {(selectedReceipt.electricityAmount || 0) > 0 && (
                <div className="flex justify-between p-3 border-b border-white/[0.04]">
                  <span className="text-slate-300">Electricity (Submeter Consumption)</span>
                  <span className="font-semibold text-slate-100 font-mono">
                    {formatPHP(selectedReceipt.electricityAmount)}
                  </span>
                </div>
              )}

              {(selectedReceipt.waterAmount || 0) > 0 && (
                <div className="flex justify-between p-3 border-b border-white/[0.04]">
                  <span className="text-slate-300">Water Utility Share</span>
                  <span className="font-semibold text-slate-100 font-mono">
                    {formatPHP(selectedReceipt.waterAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between p-3.5 bg-gradient-to-r from-teal-950/40 to-cyan-950/40 border-t border-teal-500/20 text-sm">
                <span className="font-bold text-teal-200">Total Succeeded</span>
                <span className="font-bold text-teal-300 text-base font-mono">
                  {formatPHP(selectedReceipt.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Verification Details */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Channel:</span>
              <span className="font-bold text-slate-200">{selectedReceipt.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Transaction Reference:</span>
              <span className="font-mono text-teal-400 font-bold">{selectedReceipt.referenceNumber}</span>
            </div>
            {selectedReceipt.verifiedAt && (
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Timestamp:</span>
                <span className="text-slate-300 font-mono">{selectedReceipt.verifiedAt}</span>
              </div>
            )}
          </div>

          {/* Security & Authenticity Stamp */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-teal-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Electronic Receipt</span>
            </div>
            <span className="font-mono">BoardingHub Security Hash #BH-PH</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-white/[0.08] bg-[#071014] no-print">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Receipt
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 transition-all shadow-md shadow-teal-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
