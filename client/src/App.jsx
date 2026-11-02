import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IndustryGrid from './components/IndustryGrid';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import JobList from './components/JobList';
import CandidateModal from './components/CandidateModal';
import EmployerRequestModal from './components/EmployerRequestModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

// WhatsApp phone number (international format, no + or spaces)
const WHATSAPP_NUMBER = '919733621111';
const WHATSAPP_MESSAGE = 'Hello! I am interested in Katheval manpower services.';

function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-sticky-btn"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group"
      style={{ filter: 'drop-shadow(0 4px 16px rgba(37,211,102,0.4))' }}
    >
      {/* Tooltip label */}
      <span className="hidden sm:flex bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
        Chat with us
      </span>

      {/* WhatsApp bubble */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
      >
        {/* WhatsApp SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.004 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.344.645 4.606 1.864 6.58L2.667 29.333l6.962-1.822A13.267 13.267 0 0016.004 29.333C23.371 29.333 29.333 23.363 29.333 16S23.371 2.667 16.004 2.667zm0 24.267a11.04 11.04 0 01-5.632-1.544l-.404-.24-4.132 1.082 1.1-4.02-.264-.416A11.067 11.067 0 014.934 16c0-6.099 4.97-11.067 11.07-11.067 6.099 0 11.063 4.968 11.063 11.067 0 6.099-4.964 11.067-11.063 11.067zm6.07-8.285c-.33-.165-1.96-.969-2.264-1.079-.304-.11-.526-.165-.747.165s-.86 1.079-1.053 1.3-.387.248-.717.083c-.33-.165-1.393-.514-2.655-1.638-.98-.876-1.641-1.957-1.834-2.287-.193-.33-.02-.508.145-.672.149-.148.33-.386.497-.579.165-.193.22-.33.33-.551.11-.22.055-.413-.028-.579-.082-.165-.747-1.8-1.024-2.466-.268-.647-.54-.56-.748-.57l-.637-.011c-.22 0-.579.083-.883.413-.304.33-1.157 1.13-1.157 2.755s1.184 3.196 1.35 3.418c.165.22 2.332 3.558 5.65 4.99.79.34 1.406.544 1.888.696.793.252 1.515.216 2.086.131.636-.095 1.96-.8 2.236-1.572.276-.772.276-1.434.193-1.572-.083-.138-.304-.22-.635-.386z"/>
        </svg>
      </div>

      {/* Pulsing ring animation */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-20"
        style={{ background: '#25d366' }}
      />
    </a>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [employerModalOpen, setEmployerModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Discreet portal trigger via URL hash (#portal or #admin) or keyboard shortcut (Ctrl+Shift+A)
  React.useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#portal' || window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [selectedProfessionForApp, setSelectedProfessionForApp] = useState('');
  const [selectedIndustryForRequest, setSelectedIndustryForRequest] = useState('');

  const handleSelectIndustry = (industryName) => {
    setSelectedIndustryForRequest(industryName);
    setEmployerModalOpen(true);
  };

  const handleApplyJob = (jobTitle) => {
    setSelectedProfessionForApp(jobTitle);
    setCandidateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">

      {/* Navbar */}
      <Navbar
        onOpenCandidateModal={() => { setSelectedProfessionForApp(''); setCandidateModalOpen(true); }}
        onOpenEmployerModal={() => { setSelectedIndustryForRequest(''); setEmployerModalOpen(true); }}
        onOpenAdminModal={() => setAdminOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Pages */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero
              onOpenCandidateModal={() => { setSelectedProfessionForApp(''); setCandidateModalOpen(true); }}
              onOpenEmployerModal={() => setEmployerModalOpen(true)}
            />
            <StatsSection />
            <JobList onApplyJob={handleApplyJob} />
            <IndustryGrid onSelectIndustry={handleSelectIndustry} />
            <FeaturesSection />
          </>
        )}

        {activeTab === 'jobs' && (
          <div className="pt-2">
            <JobList onApplyJob={handleApplyJob} />
          </div>
        )}

        {activeTab === 'industries' && (
          <div className="pt-8">
            <IndustryGrid onSelectIndustry={handleSelectIndustry} />
            <FeaturesSection />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="pt-8">
            <FeaturesSection />
            <StatsSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenCandidateModal={() => setCandidateModalOpen(true)}
        onOpenEmployerModal={() => setEmployerModalOpen(true)}
        onOpenAdminModal={() => setAdminOpen(true)}
      />

      {/* WhatsApp Sticky Button */}
      <WhatsAppButton />

      {/* Modals */}
      <CandidateModal
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
        defaultProfession={selectedProfessionForApp}
      />

      <EmployerRequestModal
        isOpen={employerModalOpen}
        onClose={() => setEmployerModalOpen(false)}
        defaultIndustry={selectedIndustryForRequest}
      />

      {/* Admin — full-screen overlay */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

    </div>
  );
}
