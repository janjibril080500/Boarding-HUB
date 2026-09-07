import React from 'react';
import {
  Sparkles,
  Check,
  Building2,
  ShieldCheck,
  Zap,
  CreditCard,
  Crown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPHP } from '../../utils/formatters';

export const SubscriptionView: React.FC = () => {
  const { subscriptionPlan, updateSubscriptionPlan, addToast } = useApp();

  const plans = [
    {
      id: 'STARTER' as const,
      name: 'Starter Dorm',
      price: 499,
      period: '/ month',
      badge: 'Small Dorms',
      description: 'Perfect for small boarding houses with up to 10 rooms.',
      features: [
        'Up to 10 Rooms / 40 Bedspaces',
        'GCash & Maya Payment Verification',
        'Submeter Utility Calculator',
        'Tenant Mobile Hub Portal',
        'Basic Financial Reports'
      ]
    },
    {
      id: 'BUSINESS' as const,
      name: 'Business Pro',
      price: 1299,
      period: '/ month',
      badge: 'Most Popular',
      description: 'Ideal for active dormitories & bedspace properties with up to 50 rooms.',
      features: [
        'Up to 50 Rooms / 200 Bedspaces',
        '1-Click Bulk Monthly Billing Engine',
        'Automated SMS & In-App Reminders',
        'Full P&L, Staff & Expense Management',
        'Maintenance Ticket Dispatch System',
        'Priority Philippine Support 24/7'
      ],
      popular: true
    },
    {
      id: 'PROPERTY' as const,
      name: 'Enterprise Multi-Building',
      price: 2999,
      period: '/ month',
      badge: 'Large Operators',
      description: 'Multi-property operators with unlimited rooms, caretakers & branch reporting.',
      features: [
        'Unlimited Buildings & Rooms',
        'Multiple Staff & Caretaker Roles',
        'Barangay Regulatory Tax Filing Reports',
        'Custom Domain & Brand White-labeling',
        'Dedicated Account Manager'
      ]
    }
  ];

  const handleSelectPlan = (planId: any) => {
    updateSubscriptionPlan(planId);
    addToast({
      title: 'Plan Updated',
      message: `Your property workspace is now active on the ${planId} plan.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-300">
          BoardingHub Subscription Plans
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
          Simple, Transparent Pricing for Philippine Landlords
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Automate collections, save 15+ hours per month on submeters & GCash reconciliation. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map(p => {
          const isActive = subscriptionPlan === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl bg-[#101F23] border shadow-xl flex flex-col justify-between space-y-6 relative transition-all ${
                p.popular ? 'border-teal-500/50 shadow-teal-500/10 scale-105' : 'border-white/[0.08]'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md">
                  MOST POPULAR IN PH
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-100">{formatPHP(p.price)}</span>
                  <span className="text-xs text-slate-400">{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(p.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 cursor-default'
                    : 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 hover:opacity-90 shadow-md shadow-teal-500/20'
                }`}
              >
                {isActive ? 'Current Active Plan' : 'Switch to this Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
