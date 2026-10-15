import React, { useState } from 'react';
import { X, Globe, FileText, Copy, Check, Briefcase, Award } from 'lucide-react';
import { updateCandidateStatus } from '../services/api';

export default function PassportCvViewerModal({ candidate, onClose, onStatusUpdated }) {
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(candidate?.status || 'Pending Review');
  const [updating, setUpdating] = useState(false);

  if (!candidate) return null;

  const handleCopyText = () => {
    const textContent = `
======================================================
KATHEVAL MANPOWER SOLUTIONS (katheval.al) - CANDIDATE PROFILE
Reference Code: ${candidate.candidate_code}
Full Name: ${candidate.full_name}
Profession: ${candidate.profession} (${candidate.experience_years} Years Experience)
Contact: ${candidate.email} | ${candidate.phone}
Current Status: ${currentStatus}
======================================================

--- PASSPORT RECORD DETAILS ---
Passport Number: ${candidate.passport_number}
Name on Passport: ${candidate.passport_full_name}
Nationality: ${candidate.passport_nationality}
Date of Birth: ${candidate.passport_dob || 'N/A'}
Issue Date: ${candidate.passport_issue_date || 'N/A'}
Expiry Date: ${candidate.passport_expiry_date || 'N/A'}
Place of Issue: ${candidate.passport_place_of_issue || 'N/A'}
Visa / License History: ${candidate.passport_additional_notes || 'None'}

--- RESUME & CV DETAILS ---
Professional Summary:
${candidate.cv_summary || 'N/A'}

Detailed Work Experience:
${candidate.cv_work_experience || 'N/A'}

Technical Skills:
${candidate.cv_skills_list || 'N/A'}

Certifications & Licenses:
${candidate.cv_certifications || 'N/A'}

Education Details:
${candidate.cv_education_details || 'N/A'}

Languages Spoken:
${candidate.cv_languages || 'N/A'}
======================================================
`;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setUpdating(true);
    try {
      await updateCandidateStatus(candidate.id, newStatus);
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-300 shadow-2xl overflow-hidden my-4 sm:my-8 relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold font-display text-lg">
              {candidate.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-bold">{candidate.full_name}</h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {candidate.candidate_code}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {candidate.profession} &bull; {candidate.experience_years} Yrs Exp &bull; {candidate.desired_country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Status:</span>
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={updating}
                className="bg-slate-800 border border-slate-700 text-xs font-bold text-blue-300 rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="Pending Review">Pending Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Deployed">Deployed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Copy Text Button */}
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-300" />}
              <span>{copied ? 'Copied' : 'Copy Profile'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-slate-50">
          
          {/* PASSPORT DETAILS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-900 font-display font-bold text-sm">
                <Globe className="w-4 h-4 text-blue-700" />
                <span>PASSPORT DOCUMENTATION DETAILS</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Verified Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Passport Number</span>
                <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                  {candidate.passport_number}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Passport Full Name</span>
                <span className="font-bold text-slate-800">
                  {candidate.passport_full_name || candidate.full_name}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Nationality</span>
                <span className="font-bold text-slate-800">
                  {candidate.passport_nationality}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Date of Birth</span>
                <span className="text-slate-700 font-medium">{candidate.passport_dob || 'N/A'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Issue & Expiry Dates</span>
                <span className="text-slate-700 font-medium">
                  {candidate.passport_issue_date || 'N/A'} / <strong className="text-emerald-700">{candidate.passport_expiry_date || 'N/A'}</strong>
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Place of Issue</span>
                <span className="text-slate-700 font-medium">{candidate.passport_place_of_issue || 'N/A'}</span>
              </div>
            </div>

            {candidate.passport_additional_notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-700 font-bold block mb-1">Visa & License Notes:</span>
                <p className="text-slate-600 leading-relaxed font-mono">{candidate.passport_additional_notes}</p>
              </div>
            )}
          </div>

          {/* CV & WORK EXPERIENCE DETAILS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-900 font-display font-bold text-sm">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>PROFESSIONAL RESUME & WORK EXPERIENCE</span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Executive Summary</h5>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {candidate.cv_summary || 'No summary provided.'}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Work History</h5>
              <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line font-mono">
                {candidate.cv_work_experience || 'No work history details logged.'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-900 block mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-700" /> Key Technical Skills
                </span>
                <p className="text-slate-700 leading-relaxed">{candidate.cv_skills_list || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-900 block mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-700" /> Certifications & Licenses
                </span>
                <p className="text-slate-700 leading-relaxed">{candidate.cv_certifications || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block mb-0.5">Education / Diploma:</span>
                <span className="text-slate-800 font-medium">{candidate.cv_education_details || candidate.education_level || 'N/A'}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500 block mb-0.5">Languages Spoken:</span>
                <span className="text-slate-800 font-medium">{candidate.cv_languages || 'N/A'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
