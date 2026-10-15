import React from 'react';
import { ShieldCheck, Award, Globe, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Trade Tested',
    desc: 'Every candidate passes practical skill verification before deployment.',
    badge: 'Certified',
    cardBg: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100 text-blue-700',
    badgeCls: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Globe,
    title: 'Visa & Legal',
    desc: 'Complete overseas clearance, consular processing, and contract management.',
    badge: 'Legal',
    cardBg: 'bg-emerald-50 border-emerald-100',
    iconBg: 'bg-emerald-100 text-emerald-700',
    badgeCls: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: Users,
    title: 'High Capacity',
    desc: 'Scale from 50 to 500+ workers for mega-construction and industrial projects.',
    badge: 'Enterprise',
    cardBg: 'bg-violet-50 border-violet-100',
    iconBg: 'bg-violet-100 text-violet-700',
    badgeCls: 'bg-violet-100 text-violet-700',
  },
  {
    icon: ShieldCheck,
    title: 'ISO Compliant',
    desc: 'Fully aligned with international labor standards and GCC guidelines.',
    badge: 'Compliant',
    cardBg: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100 text-amber-700',
    badgeCls: 'bg-amber-100 text-amber-700',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-4">
            Why Katheval
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Built for Enterprise Reliability
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`rounded-2xl p-6 border flex flex-col gap-4 hover:shadow-md transition-shadow ${f.cardBg}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${f.badgeCls}`}>
                    {f.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
