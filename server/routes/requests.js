const express = require('express');
const router = express.Router();
const db = require('../db');

function generateRequestCode() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `REQ-${year}-${randomNum}`;
}

// POST /api/requests - Submit Employer Manpower Requirement
router.post('/', async (req, res) => {
  try {
    const {
      company_name,
      contact_person,
      email,
      phone,
      industry,
      required_profession,
      workers_count,
      work_location,
      duration,
      salary_offered,
      requirements_description
    } = req.body;

    if (!company_name || !contact_person || !email || !phone || !required_profession) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: company_name, contact_person, email, phone, and required_profession are required.'
      });
    }

    const request_code = generateRequestCode();
    const isConnected = db.getIsConnected();

    if (isConnected) {
      const sql = `
        INSERT INTO employer_requests (
          request_code, company_name, contact_person, email, phone, industry,
          required_profession, workers_count, work_location, duration, salary_offered,
          requirements_description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New Request')
      `;

      const result = await db.query(sql, [
        request_code, company_name, contact_person, email, phone, industry || 'General',
        required_profession, parseInt(workers_count || 1, 10), work_location || '',
        duration || '', salary_offered || '', requirements_description || ''
      ]);

      return res.status(201).json({
        success: true,
        message: 'Employer manpower request submitted successfully!',
        request_code,
        id: result.insertId
      });
    } else {
      const newReq = {
        id: db.inMemoryStore.employer_requests.length + 1,
        request_code,
        company_name,
        contact_person,
        email,
        phone,
        industry: industry || 'General',
        required_profession,
        workers_count: parseInt(workers_count || 1, 10),
        work_location,
        duration,
        salary_offered,
        requirements_description,
        status: 'New Request',
        created_at: new Date().toISOString()
      };
      db.inMemoryStore.employer_requests.unshift(newReq);

      return res.status(201).json({
        success: true,
        message: 'Employer manpower request submitted successfully!',
        request_code,
        id: newReq.id
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error saving employer request: ' + err.message });
  }
});

// GET /api/requests - List employer requests
router.get('/', async (req, res) => {
  try {
    const isConnected = db.getIsConnected();
    if (isConnected) {
      const requests = await db.query('SELECT * FROM employer_requests ORDER BY id DESC');
      return res.json({ success: true, data: requests });
    } else {
      return res.json({ success: true, data: db.inMemoryStore.employer_requests });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching requests: ' + err.message });
  }
});

// PUT /api/requests/:id/status - Update request status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isConnected = db.getIsConnected();

    if (isConnected) {
      await db.query('UPDATE employer_requests SET status = ? WHERE id = ?', [status, id]);
      return res.json({ success: true, message: `Request status updated to ${status}` });
    } else {
      const item = db.inMemoryStore.employer_requests.find(r => r.id.toString() === id);
      if (item) {
        item.status = status;
        return res.json({ success: true, message: `Request status updated to ${status}` });
      }
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating status: ' + err.message });
  }
});

module.exports = router;
