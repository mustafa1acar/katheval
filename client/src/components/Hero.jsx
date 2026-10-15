import React from 'react';
import { Users, Building2, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';

const highlights = [
  { icon: ShieldCheck, label: 'Trade Tested', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { icon: Globe, label: 'Visa Ready', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { icon: Zap, label: '14-Day Deploy', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

const stats = [
  { value: '12,500+', label: 'Deployed Workers' },
  { value: '500+', label: 'Enterprise Clients' },
  { value: '12', label: 'Specialized Trades' },
];

export default function Hero({ onOpenCandidateModal, onOpenEmployerModal }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 pt-20 pb-20 sm:pt-28 sm:pb-28 border-b border-slate-200">
      {/* Soft background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

        {/* License Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold tracking-wide shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Licensed International Recruitment Agency
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight">
          Skilled Workers,{' '}
          <span style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 60%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Global Projects
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Katheval connects verified, trade-tested manpower to construction, oil & gas, hospitality, and logistics projects worldwide.
        </p>

        {/* Highlight Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {highlights.map(({ icon: Icon, label, color }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold shadow-sm ${color}`}>
              <Icon className="w-4 h-4" />
              {label}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 items-center justify-center pt-2">
          <button
            id="hero-employer-cta"
            onClick={onOpenEmployerModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/20 transition-all group"
          >
            <Building2 className="w-5 h-5" />
            Request Manpower
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-candidate-cta"
            onClick={onOpenCandidateModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-sm"
          >
            <Users className="w-5 h-5 text-blue-600" />
            Apply as Worker
          </button>
        </div>

        {/* Key Stats Row */}
        <div className="pt-8 border-t border-slate-200/80 max-w-xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
