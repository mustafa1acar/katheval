import React, { useState, useEffect } from 'react';
import { UserPlus, Building2, Menu, X, ChevronRight, Phone, Mail, Globe } from 'lucide-react';

export default function Navbar({ onOpenCandidateModal, onOpenEmployerModal, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'home',       label: 'Home' },
    { id: 'industries', label: 'Labor Sectors' },
    { id: 'about',      label: 'About' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top ribbon - Light theme */}
      <div className="bg-slate-50 text-slate-600 text-[11px] py-2 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-blue-600" /> Katheval SH.P.K. · Licensed Global Manpower Agency · <span className="text-blue-700 font-semibold">katheval.al</span>
          </span>
          <div className="hidden sm:flex items-center gap-4 text-slate-500 font-medium">
            <a href="https://wa.me/919733621111" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Phone className="w-3 h-3 text-blue-600" />+91 97336 21111
            </a>
            <a href="mailto:manpower@katheval.al" className="hidden md:flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Mail className="w-3 h-3 text-blue-600" />manpower@katheval.al
            </a>
          </div>
        </div>
      </div>

      <header
        id="main-navbar"
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all ${scrolled ? 'shadow-md border-b border-slate-200' : 'border-b border-slate-200/80'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">

          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/logo.jpeg"
                alt="Katheval Logo"
                className="h-9 sm:h-10 w-auto max-w-[160px] sm:max-w-[200px] object-contain"
                style={{ maxHeight: '42px' }}
              />
            </div>
            <div className="hidden lg:block border-l border-slate-200 pl-3">
              <span className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors block tracking-tight">
                KATHEVAL
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                Human Resources & Supply · katheval.al
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`py-1 relative transition-colors ${
                  activeTab === link.id
                    ? 'text-blue-700 font-bold'
                    : 'hover:text-blue-600'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons (No suspicious lock/key icon in public header) */}
          <div className="flex items-center gap-2.5">
            <button
              id="nav-employer-btn"
              onClick={onOpenEmployerModal}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all shadow-sm"
            >
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>Request Workers</span>
            </button>

            <button
              id="nav-candidate-btn"
              onClick={onOpenCandidateModal}
              className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Apply</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 md:hidden border border-slate-200"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-700" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end p-4">
          <div className="bg-white rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <img src="/logo.jpeg" alt="Katheval" className="h-9 w-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-slate-100 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === link.id
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCandidateModal(); }}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <UserPlus className="w-5 h-5" /> Apply as Worker
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenEmployerModal(); }}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200 flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4 text-blue-700" /> Request Workers
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
