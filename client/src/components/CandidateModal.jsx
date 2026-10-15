import React, { useState, useEffect } from 'react';
import { createCandidate } from '../services/api';
import { X, FileText, CheckCircle2, User, Globe, Briefcase, AlertCircle, ArrowRight, ArrowLeft, Copy, Check } from 'lucide-react';

export default function CandidateModal({ isOpen, onClose, defaultProfession = '' }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    profession: defaultProfession || '',
    experience_years: '3',
    desired_country: 'Qatar / UAE',
    education_level: 'Vocational / Technical Diploma',
    // PASSPORT DETAILS
    passport_number: '',
    passport_full_name: '',
    passport_nationality: '',
    passport_dob: '',
    passport_issue_date: '',
    passport_expiry_date: '',
    passport_place_of_issue: '',
    passport_additional_notes: '',
    // CV DETAILS
    cv_summary: '',
    cv_work_experience: '',
    cv_education_details: '',
    cv_skills_list: '',
    cv_certifications: '',
    cv_languages: 'English, Arabic'
  });

  const [activeStep, setActiveStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (defaultProfession) {
      setFormData(prev => ({ ...prev, profession: defaultProfession }));
    }
  }, [defaultProfession]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setErrorMessage('');
    if (activeStep === 1) {
      if (!formData.full_name || !formData.email || !formData.phone || !formData.profession) {
        setErrorMessage('Please complete all required personal fields: Full Name, Email, Phone, and Profession.');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!formData.passport_number || !formData.passport_nationality) {
        setErrorMessage('Please complete required Passport Number and Nationality fields.');
        return;
      }
      setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.full_name || !formData.email || !formData.phone || !formData.profession || !formData.passport_number || !formData.passport_nationality) {
      setErrorMessage('Please fill in required fields: Full Name, Email, Phone, Profession, Passport Number, and Nationality.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createCandidate(formData);
      if (res.success) {
        setSuccessResult(res);
      } else {
        setErrorMessage(res.message || 'Failed to submit application.');
      }
    } catch (err) {
      setErrorMessage('Network error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSuccessResult(null);
    setErrorMessage('');
    setActiveStep(1);
    onClose();
  };

  const copyCode = () => {
    if (successResult?.candidate_code) {
      navigator.clipboard.writeText(successResult.candidate_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-300 shadow-2xl overflow-hidden my-4 sm:my-8 relative flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold leading-tight">
                Candidate Application & Passport Registration
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Katheval SH.P.K. Overseas Recruitment & Human Resources · katheval.al
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successResult ? (
          <div className="p-6 sm:p-12 text-center space-y-6 my-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h4 className="font-display text-2xl font-bold text-slate-900">Application Submitted Successfully!</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Your passport information and professional resume details have been logged in our recruitment portal. Our talent officer will contact you.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 p-4 rounded-2xl max-w-sm mx-auto shadow-sm space-y-2">
              <span className="text-[11px] text-slate-500 font-bold uppercase block">Candidate Tracking Reference Code</span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-display text-2xl font-extrabold text-blue-700 tracking-wider font-mono">
                  {successResult.candidate_code}
                </span>
                <button onClick={copyCode} className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300">
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">Save this reference number for application inquiries.</span>
            </div>

            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md"
              >
                Close Application Window
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-slate-50">
            
            {/* Stepper Progress */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeStep === 1 ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">1. Personal Info</span>
                  <span className="sm:hidden">1. Personal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeStep === 2 ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">2. Passport Details</span>
                  <span className="sm:hidden">2. Passport</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeStep === 3 ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">3. Work & Resume</span>
                  <span className="sm:hidden">3. Resume</span>
                </button>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-700 h-full transition-all duration-300"
                  style={{ width: activeStep === 1 ? '33.3%' : activeStep === 2 ? '66.6%' : '100%' }}
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: PERSONAL DETAILS */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    placeholder="e.g. Tariq Hassan Al-Mansoor"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tariq@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Profession / Trade *</label>
                  <input
                    type="text"
                    name="profession"
                    required
                    placeholder="e.g. Heavy Crane Operator, Welder, Mason..."
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
                  <select
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3-5 Years</option>
                    <option value="6">6-10 Years</option>
                    <option value="10">10+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Location</label>
                  <input
                    type="text"
                    name="desired_country"
                    placeholder="e.g. Qatar, UAE, Saudi Arabia, Local"
                    value={formData.desired_country}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Education / Technical Training</label>
                  <input
                    type="text"
                    name="education_level"
                    placeholder="e.g. Vocational Technical Diploma, ITI Trade Certificate"
                    value={formData.education_level}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PASSPORT DETAILS */}
            {activeStep === 2 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Passport Number *</label>
                    <input
                      type="text"
                      name="passport_number"
                      required
                      placeholder="e.g. N78945612"
                      value={formData.passport_number}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name on Passport *</label>
                    <input
                      type="text"
                      name="passport_full_name"
                      placeholder="e.g. TARIQ HASSAN AL MANSOOR"
                      value={formData.passport_full_name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nationality *</label>
                    <input
                      type="text"
                      name="passport_nationality"
                      required
                      placeholder="e.g. Egyptian, Indian, Pakistani, Turkish, etc."
                      value={formData.passport_nationality}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="passport_dob"
                      value={formData.passport_dob}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Passport Issue Date</label>
                    <input
                      type="date"
                      name="passport_issue_date"
                      value={formData.passport_issue_date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Passport Expiry Date</label>
                    <input
                      type="date"
                      name="passport_expiry_date"
                      value={formData.passport_expiry_date}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Place / Authority of Issue</label>
                    <input
                      type="text"
                      name="passport_place_of_issue"
                      placeholder="e.g. Cairo Passport Authority / Mumbai"
                      value={formData.passport_place_of_issue}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visa History / License Notes</label>
                    <textarea
                      name="passport_additional_notes"
                      rows={2}
                      placeholder="List any GCC driving license numbers, previous overseas visa history, or clearance details..."
                      value={formData.passport_additional_notes}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: WORK HISTORY & RESUME */}
            {activeStep === 3 && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Executive Resume Summary</label>
                  <textarea
                    name="cv_summary"
                    rows={2}
                    placeholder="Briefly state your trade background, machinery operated, and key qualifications..."
                    value={formData.cv_summary}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Work Experience History</label>
                  <textarea
                    name="cv_work_experience"
                    rows={4}
                    placeholder="List past companies, employment dates, project locations, and trade responsibilities..."
                    value={formData.cv_work_experience}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Key Technical & Trade Skills</label>
                    <textarea
                      name="cv_skills_list"
                      rows={3}
                      placeholder="e.g. Tower Cranes, Rigging Safety, Pipe Welding 6G, Blueprint Reading..."
                      value={formData.cv_skills_list}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Certifications & Licenses</label>
                    <textarea
                      name="cv_certifications"
                      rows={3}
                      placeholder="e.g. TUV Lifting License #9948, OSHA Safety Certificate, AWS Welding Qualification..."
                      value={formData.cv_certifications}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Education Details</label>
                    <input
                      type="text"
                      name="cv_education_details"
                      placeholder="School / Technical Institute Name, Year"
                      value={formData.cv_education_details}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Spoken Languages</label>
                    <input
                      type="text"
                      name="cv_languages"
                      placeholder="e.g. English, Arabic, Hindi"
                      value={formData.cv_languages}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : <div />}

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Final Application'}
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
