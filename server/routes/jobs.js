const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/jobs - Fetch available job listings
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const isConnected = db.getIsConnected();

    if (isConnected) {
      let sql = 'SELECT * FROM jobs WHERE is_active = TRUE';
      const params = [];

      if (category && category !== 'All') {
        sql += ' AND category = ?';
        params.push(category);
      }
      if (search) {
        sql += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      sql += ' ORDER BY id DESC';
      const jobs = await db.query(sql, params);
      return res.json({ success: true, data: jobs });
    } else {
      let list = db.inMemoryStore.jobs.filter(j => j.is_active);
      if (category && category !== 'All') {
        list = list.filter(j => j.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(j =>
          j.title.toLowerCase().includes(s) ||
          j.description.toLowerCase().includes(s) ||
          j.location.toLowerCase().includes(s)
        );
      }
      return res.json({ success: true, data: list });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching jobs: ' + err.message });
  }
});

// POST /api/jobs - Add new job opening (Admin)
router.post('/', async (req, res) => {
  try {
    const { title, category, location, vacancies, salary_range, contract_period, description, requirements, benefits } = req.body;
    if (!title || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, Category and Location are required.' });
    }

    const isConnected = db.getIsConnected();
    if (isConnected) {
      const sql = `
        INSERT INTO jobs (title, category, location, vacancies, salary_range, contract_period, description, requirements, benefits, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      `;
      const result = await db.query(sql, [
        title, category, location, parseInt(vacancies || 1, 10),
        salary_range || '', contract_period || '', description || '', requirements || '', benefits || ''
      ]);
      return res.status(201).json({ success: true, message: 'Job posting created successfully', id: result.insertId });
    } else {
      const newJob = {
        id: db.inMemoryStore.jobs.length + 1,
        title,
        category,
        location,
        vacancies: parseInt(vacancies || 1, 10),
        salary_range,
        contract_period,
        description,
        requirements,
        benefits,
        is_active: true,
        created_at: new Date().toISOString()
      };
      db.inMemoryStore.jobs.unshift(newJob);
      return res.status(201).json({ success: true, message: 'Job posting created successfully', id: newJob.id });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating job: ' + err.message });
  }
});

module.exports = router;
