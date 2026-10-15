import React from 'react';
import { HardHat, Flame, Hotel, Stethoscope, Truck, Wrench, Sprout, Building, ArrowUpRight } from 'lucide-react';

const industries = [
  {
    id: 'construction',
    name: 'Construction & Civil',
    icon: HardHat,
    count: '1,420+',
    roles: 'Masons · Scaffolders · Equipment Operators',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    hover: 'hover:border-amber-400 hover:shadow-amber-100',
  },
  {
    id: 'oil_gas',
    name: 'Oil & Gas / Industrial',
    icon: Flame,
    count: '850+',
    roles: '6G Welders · Pipe Fitters · NDT Technicians',
    iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
    hover: 'hover:border-blue-400 hover:shadow-blue-100',
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Catering',
    icon: Hotel,
    count: '980+',
    roles: 'Chefs · Room Attendants · Hotel Staff',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    hover: 'hover:border-emerald-400 hover:shadow-emerald-100',
  },
  {
    id: 'logistics',
    name: 'Logistics & Warehousing',
    icon: Truck,
    count: '1,100+',
    roles: 'Forklift Drivers · Heavy Trucks · Warehouse Ops',
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    hover: 'hover:border-indigo-400 hover:shadow-indigo-100',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Facility',
    icon: Stethoscope,
    count: '420+',
    roles: 'Nursing Aides · Caregivers · Sanitation Specialists',
    iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
    hover: 'hover:border-rose-400 hover:shadow-rose-100',
  },
  {
    id: 'engineering',
    name: 'MEP & Engineering',
    icon: Wrench,
    count: '760+',
    roles: 'Electricians · Plumbers · HVAC Techs',
    iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
    hover: 'hover:border-sky-400 hover:shadow-sky-100',
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Landscape',
    icon: Sprout,
    count: '640+',
    roles: 'Farm Handlers · Greenhouse Techs · Gardeners',
    iconBg: 'bg-green-50 text-green-700 border-green-200',
    hover: 'hover:border-green-400 hover:shadow-green-100',
  },
  {
    id: 'general_labor',
    name: 'General Labor',
    icon: Building,
    count: '2,100+',
    roles: 'Factory Workers · Loading Crew · Facility Cleaners',
    iconBg: 'bg-slate-100 text-slate-700 border-slate-300',
    hover: 'hover:border-slate-400 hover:shadow-slate-100',
  },
];

export default function IndustryGrid({ onSelectIndustry }) {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-4">
            Labor Sectors
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            8 Specialized Trades
          </h2>
          <p className="text-slate-500 text-sm mt-2">Click any sector to request workers</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                id={`industry-${ind.id}`}
                onClick={() => onSelectIndustry(ind.name)}
                className={`bg-white rounded-2xl p-5 border border-slate-200 cursor-pointer flex flex-col gap-4 hover:shadow-lg transition-all group ${ind.hover}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${ind.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-900">{ind.count}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{ind.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{ind.roles}</p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800 border-t border-slate-100 pt-3">
                  <span>Request Workers</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
