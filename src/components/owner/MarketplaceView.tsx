import React, { useState } from 'react';
import {
  Store,
  MapPin,
  BedDouble,
  Search,
  Star,
  Sparkles,
  Wifi,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';
import { formatPHP } from '../../utils/formatters';

export const MarketplaceView: React.FC = () => {
  const [cityFilter, setCityFilter] = useState('Davao City');

  const listings = [
    {
      id: 'list-1',
      title: 'Jibril Boarding House (Featured)',
      address: 'Matina, Davao City (Near Ateneo & UM)',
      monthlyRate: 3500,
      roomType: 'Aircon Bedspace & Solo Rooms',
      rating: 4.9,
      amenities: ['Aircon', '500Mbps Fiber WiFi', 'Submeter Electric', 'CCTV 24/7', 'Kitchenette'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      availableBeds: 3
    },
    {
      id: 'list-2',
      title: 'Davao Heights Dormitory',
      address: 'Bajada, Davao City (Near SPMC & Abreeza)',
      monthlyRate: 4200,
      roomType: 'Solo Studio & 2-Person Share',
      rating: 4.7,
      amenities: ['Aircon', 'Ensuite Bath', 'Generator Backup', 'RFID Gate'],
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      availableBeds: 5
    },
    {
      id: 'list-3',
      title: 'San Pedro Student Haven',
      address: 'Poblacion, Davao City (Near UIC & San Pedro College)',
      monthlyRate: 3200,
      roomType: '4-Bed Aircon Bedspace',
      rating: 4.8,
      amenities: ['Free WiFi', 'Study Lounge', 'Study Desks', 'Water Purifier'],
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
      availableBeds: 2
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            BoardingHub PH Marketplace & Directory
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
              Live Public Directory
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover verified boarding houses, dormitories, and bedspaces across Davao City, Cebu, and Metro Manila.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {listings.map(item => (
          <div key={item.id} className="rounded-2xl bg-[#101F23] border border-white/[0.06] shadow-xl overflow-hidden flex flex-col justify-between hover:border-teal-500/40 transition-all group">
            <div>
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-teal-300 border border-teal-500/30">
                  {item.availableBeds} beds available
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {item.address}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.amenities.map(a => (
                    <span key={a} className="px-2 py-0.5 rounded-md bg-[#0B171B] border border-white/[0.06] text-[10px] text-slate-300">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Starting from</span>
                <span className="text-lg font-extrabold text-teal-300 font-mono">
                  {formatPHP(item.monthlyRate)}
                </span>
                <span className="text-[10px] text-slate-400"> / month</span>
              </div>

              <button className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90 transition-all">
                Inquire Bedspace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
