import React from 'react';
import { Users, ShieldCheck, Clock, Award } from 'lucide-react';

const stats = [
  { value: '12,500+', label: 'Deployed Worldwide',  icon: Users,       color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-100' },
  { value: '99.4%',   label: 'Client Satisfaction', icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
  { value: '100%',    label: 'Trade Certified',      icon: Award,       color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-100' },
  { value: '14 Days', label: 'Avg. Mobilization',   icon: Clock,       color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-100' },
];

export default function StatsSection() {
  return (
    <section className="py-12 sm:py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ value, label, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center text-center py-6 px-4 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-3 ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
