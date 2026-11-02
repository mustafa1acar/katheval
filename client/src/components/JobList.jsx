import React, { useState, useEffect } from 'react';
import { fetchJobs } from '../services/api';
import { MapPin, DollarSign, Calendar, Users, Briefcase, Search, ArrowRight, AlertCircle } from 'lucide-react';

export default function JobList({ onApplyJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Construction', 'Oil & Gas', 'Engineering', 'Hospitality', 'Logistics'];

  useEffect(() => {
    loadJobs();
  }, [selectedCategory, searchQuery]);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await fetchJobs(selectedCategory, searchQuery);
      if (res.success) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 sm:py-20 relative border-b border-slate-200 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-blue-700 bg-blue-50 border border-blue-200 inline-block px-3 py-1.5 rounded-full mb-3">
              Open Vacancies
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Active Recruitment Openings
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Browse verified open positions across GCC & Europe and apply directly with your text CV & passport details.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trade, role, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-700/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Loading vacancies...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl p-12 text-center max-w-lg mx-auto border border-slate-200 bg-white shadow-sm">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Vacancies Found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all hover:-translate-y-1 group"
              >
                <div className="space-y-4">
                  
                  {/* Category & Vacancies Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                      {job.category}
                    </span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {job.vacancies} open
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {job.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.salary_range}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.contract_period}</span>
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                      {job.description}
                    </p>
                  )}
                </div>

                {/* Apply Action */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onApplyJob(job.title)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-all flex items-center justify-center gap-2 group/btn shadow-md shadow-blue-700/15"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
