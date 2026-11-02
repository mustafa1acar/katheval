const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static assets (such as logo.jpeg)
app.use('/assets', express.static(path.join(__dirname, '..')));

// Register API Routes
app.use('/api/candidates', require('./routes/candidates'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Katheval Manpower Supply Platform',
    domain: 'katheval.al',
    payment_system: 'DISABLED (No payments)',
    file_upload_system: 'DISABLED (No file uploads - Text format only)',
    database: db.getIsConnected() ? 'MySQL Connected' : 'Resilient In-Memory Fallback',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build static files if present
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Katheval Manpower Supply API</title></head>
        <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
          <h1>Katheval Manpower Supply Server Running</h1>
          <p>Backend API is active on port ${PORT}.</p>
          <p>Official Domain: katheval.al</p>
          <p>Client dev server running via Vite.</p>
        </body>
      </html>
    `);
  }
});

// Initialize Database connection & start server
db.initDatabaseConnection().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`  Katheval Manpower Supply Platform (katheval.al)`);
    console.log(`  Server listening on port: ${PORT}`);
    console.log(`  Database: ${db.getIsConnected() ? 'MySQL Connected' : 'Auto-reconnecting...'}`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===================================================`);
  });

  // Graceful shutdown for Docker / Coolify containers
  const shutdown = (signal) => {
    console.log(`[Server] Received ${signal}, closing HTTP server gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
});

