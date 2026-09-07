import React from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  const faqs = [
    {
      q: 'How does BoardingHub automate GCash & Maya reconciliation?',
      a: 'Tenants submit their 11-digit reference number and optional screenshot. The owner receives instant push alerts to 1-click verify and generate stamped digital official receipts.'
    },
    {
      q: 'How do submeters work for bedspace rooms with multiple tenants?',
      a: 'Input the previous and current kWh meter numbers. BoardingHub multiplies usage by your Meralco/Davao Light rate and splits the cost equally or proportionally across all occupants.'
    },
    {
      q: 'Can I print official receipts and tenancy agreements?',
      a: 'Yes, every approved payment generates an official BIR-aligned electronic acknowledgement formatted for standard 80mm thermal receipt printers or standard A4/Letter paper.'
    },
    {
      q: 'What are the Philippine Barangay clearance guidelines for boarding houses?',
      a: 'Under RA 580 and local city ordinances (e.g. Davao City Dormitory Code), boarding houses must maintain a verified resident registry, emergency contact log, and sanitary permits.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
          Help, Knowledge Base & PH Landlord Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Guides, Philippine dorm compliance regulations, submeter troubleshooting, and dedicated assistance.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Phone className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Hotline Support</h3>
          <p className="text-xs text-slate-400">+63 (082) 299-8800</p>
          <span className="text-[10px] text-teal-300">Mon–Sat, 8AM–6PM PHT</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Email Helpdesk</h3>
          <p className="text-xs text-slate-400">support@boardinghub.ph</p>
          <span className="text-[10px] text-cyan-300">Guaranteed &lt; 2hr reply</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Viber Community</h3>
          <p className="text-xs text-slate-400">PH Landlords Guild</p>
          <span className="text-[10px] text-amber-300">3,400+ Active Owners</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="p-6 rounded-2xl bg-[#101F23] border border-white/[0.08] shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <BookOpen className="w-4 h-4 text-teal-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#0B171B] border border-white/[0.04] space-y-1">
              <h4 className="text-xs font-bold text-slate-200">{faq.q}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
