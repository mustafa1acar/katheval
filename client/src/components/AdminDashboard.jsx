import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminStatus, adminLogin, fetchCandidates, fetchEmployerRequests,
  fetchJobs, createJob, updateRequestStatus
} from '../services/api';
import PassportCvViewerModal from './PassportCvViewerModal';
import {
  KeyRound, Users, Building2, Briefcase, Search, RefreshCw, Eye,
  Plus, X, Lock, LayoutDashboard, ChevronRight, LogOut, Mail, Phone,
  Globe, MapPin, Clock, CheckCircle2, AlertCircle, TrendingUp, Filter,
  Star, Calendar, Hash, Activity, ShieldCheck, Zap
} from 'lucide-react';

/* ─── Status badge helper ─────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    'Deployed':            'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Interview Scheduled': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Pending Review':      'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Archived':            'bg-slate-500/15 text-slate-400 border-slate-500/30',
    'New Request':         'bg-sky-500/15 text-sky-400 border-sky-500/30',
    'In Progress':         'bg-violet-500/15 text-violet-400 border-violet-500/30',
    'Fulfilled':           'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Closed':              'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${map[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

/* ─── Stat Card ───────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="admin-stat-card rounded-2xl p-5 border border-white/8 flex items-center justify-between group">
    <div>
      <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-white tracking-tight">{value ?? '—'}</p>
      {trend && <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</p>}
    </div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} border border-white/10 group-hover:scale-105 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

/* ─── Login Screen ───────────────────────────────────────── */
const LoginScreen = ({ onLogin, onClose }) => {
  const [identifier, setIdentifier] = useState('boss@katheval.al');
  const [pw, setPw] = useState('katheval2026!');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: 'Boss', id: 'boss@katheval.al', role: 'Executive' },
    { label: 'Admin', id: 'admin@katheval.al', role: 'System Admin' },
    { label: 'Recruiter', id: 'recruiter@katheval.al', role: 'HR & Dispatch' },
    { label: 'Worker', id: 'worker@katheval.al', role: 'Candidate Portal' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await adminLogin(identifier, pw);
      if (res.success) {
        onLogin(res.user);
      } else {
        setErr(res.message || 'Invalid username, email, or password.');
      }
    } catch (e) {
      setErr('Connection error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 admin-bg flex items-center justify-center p-4 overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/10 flex items-center gap-2 text-xs font-semibold"
        title="Close Portal Login"
      >
        <X className="w-5 h-5" />
        <span className="hidden sm:inline">Back to site</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Logo area */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Katheval Portal Access</h1>
          <p className="text-slate-400 text-xs mt-1">Multi-user Gateway for Executives, Staff & Workers · <span className="text-blue-400 font-semibold">katheval.al</span></p>
        </div>

        <div className="admin-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5 shadow-2xl">
          {err && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {err}
            </div>
          )}

          {/* Quick presets */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select User Role Profile:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => { setIdentifier(p.id); setPw('katheval2026!'); }}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    identifier === p.id
                      ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="block font-bold">{p.label}</span>
                  <span className="block text-[9px] opacity-70 font-normal">{p.role}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Username or Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username-input"
                  type="text"
                  placeholder="e.g. boss@katheval.al or worker"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password-input"
                  type="password"
                  placeholder="Enter password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  className="w-full bg-slate-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...</>
              ) : (
                <><Zap className="w-4 h-4" /> Sign In to Portal</>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 text-center text-[11px] text-slate-400">
            <p>Authorized access only &bull; Domain: <span className="text-blue-400 font-mono">katheval.al</span></p>
            <p className="mt-1 text-slate-500">Default password for demo: <code className="text-blue-300 font-mono">katheval2026!</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ─── Candidate Detail Drawer ────────────────────────────── */
const CandidateDrawer = ({ candidate, onClose, onStatusUpdated }) => {
  if (!candidate) return null;
  return (
    <PassportCvViewerModal
      candidate={candidate}
      onClose={onClose}
      onStatusUpdated={onStatusUpdated}
    />
  );
};

/* ─── Candidate Row ──────────────────────────────────────── */
const CandidateRow = ({ c, onView }) => (
  <tr className="border-b border-white/5 hover:bg-white/3 transition-colors group">
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
          {c.full_name?.charAt(0) || 'C'}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{c.full_name}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Mail className="w-3 h-3" />{c.email}
          </p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3.5">
      <p className="text-xs font-semibold text-slate-200">{c.profession}</p>
      <p className="text-[11px] text-slate-500">{c.experience_years}y exp</p>
    </td>
    <td className="px-4 py-3.5">
      <p className="font-mono text-xs font-bold text-slate-300">{c.passport_number}</p>
      <p className="text-[11px] text-slate-500">{c.passport_nationality}</p>
    </td>
    <td className="px-4 py-3.5">
      <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</p>
      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{c.desired_country}</p>
    </td>
    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
    <td className="px-4 py-3.5 text-right">
      <button
        onClick={() => onView(c)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[11px] font-bold border border-blue-500/20 transition-all group-hover:border-blue-500/40"
      >
        <Eye className="w-3.5 h-3.5" /> Full Profile
      </button>
    </td>
  </tr>
);

/* ─── Mobile Candidate Card ──────────────────────────────── */
const CandidateCard = ({ c, onView }) => (
  <div className="admin-card rounded-2xl p-4 border border-white/8 space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-base shrink-0">
          {c.full_name?.charAt(0) || 'C'}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{c.full_name}</p>
          <p className="text-[11px] text-slate-400">{c.profession} · {c.experience_years}y</p>
        </div>
      </div>
      <StatusBadge status={c.status} />
    </div>
    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
      <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{c.passport_number}</span>
      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{c.passport_nationality}</span>
      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>
      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.desired_country}</span>
    </div>
    <button
      onClick={() => onView(c)}
      className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
    >
      <Eye className="w-3.5 h-3.5" /> View Full Profile
    </button>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
export default function AdminDashboard({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('candidates');
  const [adminStatus, setAdminStatus] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [requests, setRequests] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [candSearch, setCandSearch] = useState('');
  const [candStatusFilter, setCandStatusFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '', category: 'Construction', location: 'Qatar / UAE',
    vacancies: '20', salary_range: '$1,200 - $1,600 / mo',
    contract_period: '2 Years Contract', description: '', requirements: '',
    benefits: 'Housing, Medical, Transport, Flight'
  });

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const statusRes = await fetchAdminStatus();
      if (statusRes.success) setAdminStatus(statusRes);

      if (activeTab === 'candidates') {
        const r = await fetchCandidates(candSearch, candStatusFilter);
        if (r.success) setCandidates(r.data);
      } else if (activeTab === 'demands') {
        const r = await fetchEmployerRequests();
        if (r.success) setRequests(r.data);
      } else if (activeTab === 'jobs') {
        const r = await fetchJobs();
        if (r.success) setJobs(r.data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [isAuthenticated, activeTab, candSearch, candStatusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await createJob(newJobData);
      if (r.success) { setShowAddJobModal(false); loadData(); }
    } catch (e) { alert('Error creating vacancy: ' + e.message); }
  };

  const handleUpdateRequestStatus = async (id, newStatus) => {
    try { await updateRequestStatus(id, newStatus); loadData(); }
    catch (e) { console.error(e); }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
        onClose={onClose}
      />
    );
  }

  const roleBadgeColor = {
    'Boss':          'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Administrator': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'Recruiter':     'bg-blue-500/20 text-blue-300 border-blue-500/40',
    'Worker':        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Staff':         'bg-sky-500/20 text-sky-300 border-sky-500/40'
  }[currentUser?.role || 'Staff'] || 'bg-blue-500/20 text-blue-300 border-blue-500/40';

  const navItems = [
    { id: 'candidates', label: 'Candidates', icon: Users, count: adminStatus?.stats?.total_candidates },
    { id: 'demands',    label: 'Employer Orders', icon: Building2, count: adminStatus?.stats?.total_employer_requests },
    { id: 'jobs',       label: 'Vacancies', icon: Briefcase, count: adminStatus?.stats?.active_vacancies },
  ];

  return (
    <>
      <style>{`
        .admin-bg { background: #0a0f1e; }
        .admin-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(12px); }
        .admin-stat-card { background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%); backdrop-filter: blur(12px); transition: all 0.2s ease; }
        .admin-stat-card:hover { background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%); transform: translateY(-2px); }
        .admin-sidebar { background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.07); }
        .admin-scrollbar::-webkit-scrollbar { width: 4px; }
        .admin-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .admin-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 9999px; }
        .hover\\:bg-white\\/3:hover { background: rgba(255,255,255,0.03); }
        .bg-white\\/3 { background: rgba(255,255,255,0.03); }
        .border-white\\/5 { border-color: rgba(255,255,255,0.05); }
        .border-white\\/8 { border-color: rgba(255,255,255,0.08); }
        .border-white\\/10 { border-color: rgba(255,255,255,0.10); }
      `}</style>

      <div className="fixed inset-0 z-50 admin-bg flex overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── Sidebar ── */}
        <aside className="admin-sidebar w-64 shrink-0 flex flex-col py-6 px-4 hidden lg:flex">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-base tracking-tight leading-tight">KATHEVAL</p>
              <p className="text-blue-400 font-mono text-[10px]">katheval.al</p>
            </div>
          </div>

          {/* Active User Card */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-500/30">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-bold truncate leading-tight">{currentUser?.name || 'Authorized User'}</p>
                <p className="text-slate-400 text-[10px] truncate">{currentUser?.email || 'user@katheval.al'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
              <span className="text-slate-400 font-medium">Access Role:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${roleBadgeColor}`}>
                {currentUser?.role || 'Staff'}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3 mb-2">Management</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {item.count !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-blue-500/20 text-blue-300' : 'bg-white/8 text-slate-400'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="space-y-2 pt-4 border-t border-white/8">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] text-white font-bold">katheval.al Gateway</p>
                <p className="text-[10px] text-slate-500">{adminStatus?.mysql_connected ? 'MySQL Live' : 'Memory Store'}</p>
              </div>
            </div>
            <button
              id="admin-logout-btn"
              onClick={() => {
                setIsAuthenticated(false);
                setCurrentUser(null);
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-semibold border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out & Exit
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Top Bar */}
          <header className="shrink-0 px-4 sm:px-6 py-4 border-b border-white/8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile brand */}
              <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-white font-black text-lg leading-tight">
                    {activeTab === 'candidates' && 'Candidate Directory'}
                    {activeTab === 'demands' && 'Employer Orders'}
                    {activeTab === 'jobs' && 'Vacancy Manager'}
                  </h1>
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleBadgeColor}`}>
                    {currentUser?.role || 'Staff'} View
                  </span>
                </div>
                <p className="text-slate-500 text-xs hidden sm:block">
                  {activeTab === 'candidates' && 'View and manage all registered candidate passports, CVs & trade skills'}
                  {activeTab === 'demands' && 'Track and update employer manpower requests'}
                  {activeTab === 'jobs' && 'Create and manage open job vacancies'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser && (
                <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="text-slate-400">Signed in as:</span>
                  <span className="text-white font-bold">{currentUser.name}</span>
                </div>
              )}
              <button
                onClick={loadData}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/8 transition-all"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                id="admin-close-btn"
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                  onClose();
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/8 transition-all"
                title="Exit Portal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Mobile Tab Nav */}
          <div className="lg:hidden flex gap-1 px-4 py-3 border-b border-white/8 overflow-x-auto no-scrollbar">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    active ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {item.count !== undefined && <span className="text-[10px] opacity-70">({item.count})</span>}
                </button>
              );
            })}
          </div>

          {/* Content scroll area */}
          <div className="flex-1 overflow-y-auto admin-scrollbar p-4 sm:p-6 space-y-5">

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatCard label="Total Candidates" value={adminStatus?.stats?.total_candidates ?? 0} icon={Users} color="bg-blue-500/15 text-blue-400" trend="Active pool" />
              <StatCard label="Employer Orders" value={adminStatus?.stats?.total_employer_requests ?? 0} icon={Building2} color="bg-emerald-500/15 text-emerald-400" trend="Manpower demand" />
              <StatCard label="Open Vacancies" value={adminStatus?.stats?.active_vacancies ?? 0} icon={Briefcase} color="bg-violet-500/15 text-violet-400" trend="Live listings" />
            </div>

            {/* ── Tab: Candidates ── */}
            {activeTab === 'candidates' && (
              <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="candidate-search-input"
                      type="text"
                      placeholder="Search name, code, passport, trade..."
                      value={candSearch}
                      onChange={e => setCandSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                    <select
                      id="candidate-status-filter"
                      value={candStatusFilter}
                      onChange={e => setCandStatusFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 text-sm font-semibold text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Deployed">Deployed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block admin-card rounded-2xl border border-white/8 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/8">
                        {['Candidate', 'Profession', 'Passport', 'Contact', 'Status', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading candidates...
                        </td></tr>
                      ) : candidates.length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                          No candidates matching your criteria.
                        </td></tr>
                      ) : candidates.map(c => (
                        <CandidateRow key={c.id} c={c} onView={setSelectedCandidate} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {loading ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading...
                    </div>
                  ) : candidates.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">No candidates found.</div>
                  ) : candidates.map(c => (
                    <CandidateCard key={c.id} c={c} onView={setSelectedCandidate} />
                  ))}
                </div>

                {/* Count footer */}
                {candidates.length > 0 && (
                  <p className="text-xs text-slate-500 text-right">
                    Showing <strong className="text-slate-300">{candidates.length}</strong> candidate{candidates.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* ── Tab: Employer Demands ── */}
            {activeTab === 'demands' && (
              <div className="space-y-3">
                {/* Desktop */}
                <div className="hidden md:block admin-card rounded-2xl border border-white/8 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/8">
                        {['Code', 'Company', 'Contact', 'Trade Required', 'Workers', 'Location', 'Status'].map(h => (
                          <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-slate-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading...
                        </td></tr>
                      ) : requests.length === 0 ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">No employer requests yet.</td></tr>
                      ) : requests.map(r => (
                        <tr key={r.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-4 py-3.5 font-mono text-xs font-bold text-blue-400">{r.request_code}</td>
                          <td className="px-4 py-3.5">
                            <p className="text-sm font-bold text-white">{r.company_name}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-300">
                            <p className="font-semibold">{r.contact_person}</p>
                            <p className="text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{r.phone}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs font-semibold text-slate-200">{r.required_profession}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                              <Users className="w-3 h-3" /> {r.workers_count}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{r.work_location}</td>
                          <td className="px-4 py-3.5">
                            <select
                              value={r.status}
                              onChange={e => handleUpdateRequestStatus(r.id, e.target.value)}
                              className="bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                            >
                              <option value="New Request">New Request</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Fulfilled">Fulfilled</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {requests.map(r => (
                    <div key={r.id} className="admin-card rounded-2xl p-4 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-400">{r.request_code}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{r.company_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{r.contact_person} · {r.phone}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{r.required_profession}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.workers_count} workers</span>
                        <span className="flex items-center gap-1 col-span-2"><MapPin className="w-3 h-3" />{r.work_location}</span>
                      </div>
                      <div className="pt-2 border-t border-white/8 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Update Status:</span>
                        <select
                          value={r.status}
                          onChange={e => handleUpdateRequestStatus(r.id, e.target.value)}
                          className="bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 rounded-lg px-2.5 py-1.5"
                        >
                          <option value="New Request">New Request</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Fulfilled">Fulfilled</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tab: Vacancies ── */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{jobs.length} open vacancy listing{jobs.length !== 1 ? 's' : ''}</p>
                  <button
                    id="add-vacancy-btn"
                    onClick={() => setShowAddJobModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Vacancy
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-10 text-slate-500"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {jobs.map(j => (
                      <div key={j.id} className="admin-card rounded-2xl p-5 border border-white/8 space-y-3 hover:border-white/15 transition-all">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20">
                            {j.category}
                          </span>
                          <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {j.vacancies} Positions
                          </span>
                        </div>
                        <h3 className="font-bold text-white">{j.title}</h3>
                        <div className="space-y-1.5 text-xs text-slate-400">
                          <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{j.location}</p>
                          <p className="flex items-center gap-1.5"><Star className="w-3 h-3 text-amber-400" />{j.salary_range}</p>
                          {j.contract_period && <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{j.contract_period}</p>}
                        </div>
                        {j.benefits && (
                          <div className="pt-2 border-t border-white/8">
                            <p className="text-[11px] text-slate-500">Benefits: <span className="text-slate-300">{j.benefits}</span></p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Candidate Profile Drawer */}
      {selectedCandidate && (
        <PassportCvViewerModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusUpdated={loadData}
        />
      )}

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-3xl p-6 border border-white/10 space-y-4" style={{ background: '#111827' }}>
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-white">New Job Opening</h4>
              <button onClick={() => setShowAddJobModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJobSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-400 text-xs font-bold mb-1">Job Title *</label>
                <input
                  type="text" required
                  placeholder="e.g. Scaffolder & Rigging Supervisor"
                  value={newJobData.title}
                  onChange={e => setNewJobData({ ...newJobData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-xs font-bold mb-1">Category</label>
                  <select value={newJobData.category} onChange={e => setNewJobData({ ...newJobData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500">
                    <option value="Construction">Construction</option>
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-bold mb-1">Vacancies</label>
                  <input type="number" value={newJobData.vacancies}
                    onChange={e => setNewJobData({ ...newJobData, vacancies: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold mb-1">Location</label>
                <input type="text" value={newJobData.location}
                  onChange={e => setNewJobData({ ...newJobData, location: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold mb-1">Salary Range</label>
                <input type="text" value={newJobData.salary_range}
                  onChange={e => setNewJobData({ ...newJobData, salary_range: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-bold mb-1">Description</label>
                <textarea rows={2} value={newJobData.description}
                  onChange={e => setNewJobData({ ...newJobData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/10 text-sm">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                  Create Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
