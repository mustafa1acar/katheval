const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to generate candidate tracking code
function generateCandidateCode() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `KATH-${year}-${randomNum}`;
}

// POST /api/candidates - Save candidate text CV & Passport information
router.post('/', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      profession,
      experience_years,
      desired_country,
      education_level,
      // Passport Text Details
      passport_number,
      passport_full_name,
      passport_nationality,
      passport_dob,
      passport_issue_date,
      passport_expiry_date,
      passport_place_of_issue,
      passport_additional_notes,
      // CV Text Details
      cv_summary,
      cv_work_experience,
      cv_education_details,
      cv_skills_list,
      cv_certifications,
      cv_languages
    } = req.body;

    if (!full_name || !email || !phone || !profession || !passport_number || !passport_nationality) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: full_name, email, phone, profession, passport_number, and passport_nationality are required.'
      });
    }

    // Helper to sanitize dates for MySQL DATE column
    const sanitizeDate = (val) => {
      if (!val || typeof val !== 'string' || !val.trim()) return null;
      const trimmed = val.trim();
      return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
    };

    const cleanDob = sanitizeDate(passport_dob);
    const cleanIssueDate = sanitizeDate(passport_issue_date);
    const cleanExpiryDate = sanitizeDate(passport_expiry_date);
    const cleanExpYears = parseInt(experience_years || 0, 10) || 0;

    const candidate_code = generateCandidateCode();
    const isConnected = db.getIsConnected();

    if (isConnected) {
      const sql = `
        INSERT INTO candidates (
          candidate_code, full_name, email, phone, profession, experience_years,
          desired_country, education_level, status,
          passport_number, passport_full_name, passport_nationality, passport_dob,
          passport_issue_date, passport_expiry_date, passport_place_of_issue, passport_additional_notes,
          cv_summary, cv_work_experience, cv_education_details, cv_skills_list, cv_certifications, cv_languages
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending Review', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(sql, [
        candidate_code,
        (full_name || '').trim(),
        (email || '').trim(),
        (phone || '').trim(),
        (profession || '').trim(),
        cleanExpYears,
        (desired_country || 'Any').trim(),
        (education_level || 'General').trim(),
        (passport_number || '').trim(),
        (passport_full_name || full_name || '').trim(),
        (passport_nationality || '').trim(),
        cleanDob,
        cleanIssueDate,
        cleanExpiryDate,
        (passport_place_of_issue || '').trim(),
        (passport_additional_notes || '').trim(),
        (cv_summary || '').trim(),
        (cv_work_experience || '').trim(),
        (cv_education_details || '').trim(),
        (cv_skills_list || '').trim(),
        (cv_certifications || '').trim(),
        (cv_languages || '').trim()
      ]);

      console.log(`[Candidate Application] Successfully recorded job applicant to MySQL: ${candidate_code} (${full_name} - ${profession}, DB ID: ${result.insertId})`);

      return res.status(201).json({
        success: true,
        message: 'Candidate application and text-based CV & Passport submitted successfully!',
        candidate_code,
        id: result.insertId,
        storage: 'MySQL Database'
      });
    } else {
      // In-memory fallback if MySQL temporarily disconnected
      console.warn(`[Candidate Application] Stored candidate ${candidate_code} in Resilient Memory Store (MySQL is reconnecting...)`);
      const newCandidate = {
        id: db.inMemoryStore.candidates.length + 1,
        candidate_code,
        full_name: (full_name || '').trim(),
        email: (email || '').trim(),
        phone: (phone || '').trim(),
        profession: (profession || '').trim(),
        experience_years: cleanExpYears,
        desired_country: desired_country || 'Any',
        education_level: education_level || 'General',
        status: 'Pending Review',
        passport_number: (passport_number || '').trim(),
        passport_full_name: (passport_full_name || full_name || '').trim(),
        passport_nationality: (passport_nationality || '').trim(),
        passport_dob: cleanDob,
        passport_issue_date: cleanIssueDate,
        passport_expiry_date: cleanExpiryDate,
        passport_place_of_issue: passport_place_of_issue || '',
        passport_additional_notes: passport_additional_notes || '',
        cv_summary: cv_summary || '',
        cv_work_experience: cv_work_experience || '',
        cv_education_details: cv_education_details || '',
        cv_skills_list: cv_skills_list || '',
        cv_certifications: cv_certifications || '',
        cv_languages: cv_languages || '',
        created_at: new Date().toISOString()
      };
      db.inMemoryStore.candidates.unshift(newCandidate);

      return res.status(201).json({
        success: true,
        message: 'Candidate application and text-based CV & Passport submitted successfully!',
        candidate_code,
        id: newCandidate.id,
        storage: 'In-Memory Resilient Store'
      });
    }
  } catch (err) {
    console.error('[Error saving candidate to MySQL]', err);
    return res.status(500).json({ success: false, message: 'Server error saving candidate: ' + err.message });
  }
});

// GET /api/candidates - Search & List candidates
router.get('/', async (req, res) => {
  try {
    const { search, status, profession } = req.query;
    const isConnected = db.getIsConnected();

    if (isConnected) {
      let sql = 'SELECT * FROM candidates WHERE 1=1';
      const params = [];

      if (search) {
        sql += ' AND (full_name LIKE ? OR candidate_code LIKE ? OR passport_number LIKE ? OR profession LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      if (status && status !== 'All') {
        sql += ' AND status = ?';
        params.push(status);
      }
      if (profession && profession !== 'All') {
        sql += ' AND profession LIKE ?';
        params.push(`%${profession}%`);
      }

      sql += ' ORDER BY id DESC';
      const candidates = await db.query(sql, params);
      return res.json({ success: true, data: candidates, storage: 'MySQL Database' });
    } else {
      let list = [...db.inMemoryStore.candidates];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(c =>
          c.full_name.toLowerCase().includes(s) ||
          c.candidate_code.toLowerCase().includes(s) ||
          c.passport_number.toLowerCase().includes(s) ||
          c.profession.toLowerCase().includes(s)
        );
      }
      if (status && status !== 'All') {
        list = list.filter(c => c.status === status);
      }
      if (profession && profession !== 'All') {
        list = list.filter(c => c.profession.toLowerCase().includes(profession.toLowerCase()));
      }
      return res.json({ success: true, data: list, storage: 'In-Memory Resilient Store' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving candidates: ' + err.message });
  }
});

// GET /api/candidates/:id - Get detailed candidate by ID or Candidate Code
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const isConnected = db.getIsConnected();

    if (isConnected) {
      const candidates = await db.query(
        'SELECT * FROM candidates WHERE id = ? OR candidate_code = ?',
        [id, id]
      );
      if (candidates && candidates.length > 0) {
        return res.json({ success: true, data: candidates[0] });
      }
      return res.status(404).json({ success: false, message: 'Candidate record not found' });
    } else {
      const candidate = db.inMemoryStore.candidates.find(c => c.id.toString() === id || c.candidate_code === id);
      if (candidate) {
        return res.json({ success: true, data: candidate });
      }
      return res.status(404).json({ success: false, message: 'Candidate record not found' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching candidate: ' + err.message });
  }
});

// PUT /api/candidates/:id/status - Update candidate application status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isConnected = db.getIsConnected();

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    if (isConnected) {
      await db.query('UPDATE candidates SET status = ? WHERE id = ?', [status, id]);
      return res.json({ success: true, message: `Candidate status updated to ${status}` });
    } else {
      const candidate = db.inMemoryStore.candidates.find(c => c.id.toString() === id);
      if (candidate) {
        candidate.status = status;
        return res.json({ success: true, message: `Candidate status updated to ${status}` });
      }
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating candidate status: ' + err.message });
  }
});

module.exports = router;
