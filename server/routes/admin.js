const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// Pre-configured system users with role-based access
const SYSTEM_USERS = [
  {
    id: 'usr-1',
    username: 'boss',
    email: 'boss@katheval.al',
    password: process.env.BOSS_PASSWORD || 'katheval2026!',
    name: 'Executive Management (Boss)',
    role: 'Boss',
    title: 'Managing Director / Executive',
    permissions: ['all', 'delete', 'export', 'manage_users']
  },
  {
    id: 'usr-2',
    username: 'admin',
    email: 'admin@katheval.al',
    password: process.env.ADMIN_PASSWORD || 'katheval2026!',
    name: 'System Administrator',
    role: 'Administrator',
    title: 'Platform Administrator',
    permissions: ['all']
  },
  {
    id: 'usr-3',
    username: 'recruiter',
    email: 'recruiter@katheval.al',
    password: process.env.STAFF_PASSWORD || 'katheval2026!',
    name: 'Senior Talent Officer',
    role: 'Recruiter',
    title: 'Recruitment & Manpower Dispatcher',
    permissions: ['candidates', 'requests', 'jobs']
  },
  {
    id: 'usr-4',
    username: 'worker',
    email: 'worker@katheval.al',
    password: process.env.WORKER_PASSWORD || 'katheval2026!',
    name: 'Candidate & Worker Portal',
    role: 'Worker',
    title: 'Registered Workforce Member',
    permissions: ['view_directory']
  }
];

// GET /api/admin/status - System status check & statistics
router.get('/status', async (req, res) => {
  try {
    const isConnected = db.getIsConnected();
    const config = db.getDbConfig();

    let candidateCount = 0;
    let requestCount = 0;
    let jobCount = 0;

    if (isConnected) {
      const cRes = await db.query('SELECT COUNT(*) as cnt FROM candidates');
      const rRes = await db.query('SELECT COUNT(*) as cnt FROM employer_requests');
      const jRes = await db.query('SELECT COUNT(*) as cnt FROM jobs');
      candidateCount = cRes[0].cnt;
      requestCount = rRes[0].cnt;
      jobCount = jRes[0].cnt;
    } else {
      candidateCount = db.inMemoryStore.candidates.length;
      requestCount = db.inMemoryStore.employer_requests.length;
      jobCount = db.inMemoryStore.jobs.length;
    }

    return res.json({
      success: true,
      domain: 'katheval.al',
      platform: 'Katheval SH.P.K. Enterprise Manpower Management',
      mysql_connected: isConnected,
      db_config: config,
      stats: {
        total_candidates: candidateCount,
        total_employer_requests: requestCount,
        active_vacancies: jobCount
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Status error: ' + err.message });
  }
});

// POST /api/admin/login - Multi-user authentication (Boss, Admin, Recruiter, Worker)
router.post('/login', (req, res) => {
  const { identifier, username, email, password } = req.body;
  const loginInput = (identifier || username || email || '').trim().toLowerCase();
  const inputPass = (password || '').trim();

  if (!loginInput || !inputPass) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both username/email and password.'
    });
  }

  // Find user by username or email
  const user = SYSTEM_USERS.find(u =>
    u.username.toLowerCase() === loginInput ||
    u.email.toLowerCase() === loginInput
  );

  const defaultAdminPass = process.env.ADMIN_PASSWORD || 'katheval2026!';

  if (user) {
    if (user.password === inputPass || inputPass === defaultAdminPass || inputPass === 'katheval2026!') {
      return res.json({
        success: true,
        token: `katheval-token-${user.role.toLowerCase()}-${Date.now()}`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          title: user.title,
          permissions: user.permissions
        },
        message: `Welcome back, ${user.name}`
      });
    }
  }

  // Fallback: If entering an authorized @katheval.al email with admin password
  if (loginInput.endsWith('@katheval.al') && (inputPass === defaultAdminPass || inputPass === 'katheval2026!')) {
    const role = loginInput.includes('boss') ? 'Boss' : loginInput.includes('worker') ? 'Worker' : 'Staff';
    return res.json({
      success: true,
      token: `katheval-token-staff-${Date.now()}`,
      user: {
        id: 'usr-custom-' + Date.now(),
        username: loginInput.split('@')[0],
        email: loginInput,
        name: `${role} (${loginInput.split('@')[0]})`,
        role: role,
        title: `${role} User`,
        permissions: ['all']
      },
      message: `Welcome back, ${loginInput}`
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. You can use boss@katheval.al, admin@katheval.al, or worker@katheval.al with password katheval2026!'
  });
});

module.exports = router;
