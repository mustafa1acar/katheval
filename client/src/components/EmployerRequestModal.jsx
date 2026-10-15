import React, { useState, useEffect } from 'react';
import { createEmployerRequest } from '../services/api';
import { X, Building2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function EmployerRequestModal({ isOpen, onClose, defaultIndustry = '' }) {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    industry: defaultIndustry || 'Construction & Civil Works',
    required_profession: '',
    workers_count: '25',
    work_location: 'Qatar / UAE',
    duration: '2 Years Contract',
    salary_offered: '$1,200 / month',
    requirements_description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (defaultIndustry) {
      setFormData(prev => ({ ...prev, industry: defaultIndustry }));
    }
  }, [defaultIndustry]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.company_name || !formData.contact_person || !formData.email || !formData.phone || !formData.required_profession) {
      setErrorMessage('Required fields missing: Company Name, Contact Person, Email, Phone, and Required Trade are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createEmployerRequest(formData);
      if (res.success) {
        setSuccessResult(res);
      } else {
        setErrorMessage(res.message || 'Failed to submit request.');
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-300 shadow-2xl overflow-hidden my-4 sm:my-8 relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold leading-tight">
                Submit Corporate Manpower Demand
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Katheval SH.P.K. Enterprise Workforce Supply · katheval.al
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
          <div className="p-6 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h4 className="font-display text-2xl font-bold text-slate-900">Manpower Order Received!</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Our workforce mobilization team will process your personnel requirements immediately.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 p-4 rounded-2xl max-w-sm mx-auto shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase block">Demand Reference Number</span>
              <span className="font-display text-2xl font-extrabold text-blue-700 tracking-wider font-mono mt-1 block">
                {successResult.request_code}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={resetAndClose}
                className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 bg-slate-50">
            
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Enterprise Name *</label>
                <input
                  type="text"
                  name="company_name"
                  required
                  placeholder="e.g. Al-Bahar Construction Group"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person & Title *</label>
                <input
                  type="text"
                  name="contact_person"
                  required
                  placeholder="e.g. Eng. Ahmed Al-Maktoum (HR Director)"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="hr@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+971 4 888 9900"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Trade / Profession *</label>
                <input
                  type="text"
                  name="required_profession"
                  required
                  placeholder="e.g. Masons, Welders, HVAC Technicians..."
                  value={formData.required_profession}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Number of Workers Needed</label>
                <input
                  type="number"
                  name="workers_count"
                  min="1"
                  value={formData.workers_count}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deployment Location</label>
                <input
                  type="text"
                  name="work_location"
                  placeholder="e.g. Abu Dhabi, UAE"
                  value={formData.work_location}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contract Term</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 2 Years Renewable, Project Based"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary Range</label>
                <input
                  type="text"
                  name="salary_offered"
                  placeholder="e.g. $1,000 - $1,400 / month"
                  value={formData.salary_offered}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Requirements & Scope</label>
                <textarea
                  name="requirements_description"
                  rows={3}
                  placeholder="Specify trade test requirements, food & housing accommodations provided, overtime structure..."
                  value={formData.requirements_description}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {submitting ? 'Submitting Order...' : 'Submit Manpower Supply Demand'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
