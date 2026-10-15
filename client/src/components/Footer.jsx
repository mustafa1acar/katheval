import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer({ onOpenCandidateModal, onOpenEmployerModal, onOpenAdminModal }) {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-14 pb-10 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm inline-block">
              <img
                src="/logo.jpeg"
                alt="Katheval Logo"
                className="h-10 w-auto object-contain max-w-[180px]"
                style={{ maxHeight: '42px' }}
              />
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Katheval SH.P.K. is a licensed international manpower agency connecting verified workforce to global projects.
            </p>
            <div className="flex items-center gap-2 text-blue-700 text-[11px] font-semibold bg-blue-50 px-3 py-1.5 rounded-lg w-fit border border-blue-200 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>katheval.al · People Beyond Borders</span>
            </div>
          </div>

          {/* Labor Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Labor Sectors</h4>
            <ul className="space-y-2">
              <li><button onClick={onOpenEmployerModal} className="hover:text-blue-700 transition-colors">Construction & Civil Works</button></li>
              <li><button onClick={onOpenEmployerModal} className="hover:text-blue-700 transition-colors">Oil & Gas / Welders</button></li>
              <li><button onClick={onOpenEmployerModal} className="hover:text-blue-700 transition-colors">Hospitality & Hotel Staff</button></li>
              <li><button onClick={onOpenEmployerModal} className="hover:text-blue-700 transition-colors">Logistics & Warehousing</button></li>
              <li><button onClick={onOpenEmployerModal} className="hover:text-blue-700 transition-colors">General Helper Supply</button></li>
            </ul>
          </div>

          {/* Job Seekers & Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Opportunities & Portal</h4>
            <ul className="space-y-2">
              <li><button onClick={onOpenCandidateModal} className="hover:text-blue-700 transition-colors">Online Job Application</button></li>
              <li><button onClick={onOpenCandidateModal} className="hover:text-blue-700 transition-colors">Submit Passport Details</button></li>
              <li>
                {/* Discreet text link without conspicuous lock or key icons */}
                <button
                  onClick={onOpenAdminModal}
                  className="hover:text-blue-700 transition-colors text-slate-600 font-medium"
                >
                  Staff & Operations Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Contact & Offices</h4>
            <div className="space-y-2.5 text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Pristina (HQ) · Doha · Dubai · Istanbul</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="https://wa.me/919733621111" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">
                  +91 97336 21111
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <a href="mailto:manpower@katheval.al" className="hover:text-blue-700 transition-colors">
                  manpower@katheval.al
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Katheval SH.P.K. Manpower Solutions. All rights reserved. (<span className="text-slate-600 font-medium">katheval.al</span>)</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Human Resources</span> · <span>Visa Services</span> · <span>Global Opportunities</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
