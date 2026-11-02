const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Parse database configuration from DATABASE_URL, MYSQL_URL or individual env vars
function getResolvedDbConfig() {
  const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (connectionUrl) {
    try {
      const url = new URL(connectionUrl);
      return {
        host: url.hostname || 'localhost',
        port: parseInt(url.port || '3306', 10),
        user: decodeURIComponent(url.username || 'root'),
        password: decodeURIComponent(url.password || ''),
        database: url.pathname ? url.pathname.replace(/^\//, '') : 'katheval_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
    } catch (e) {
      console.warn('[Database] Could not parse DATABASE_URL/MYSQL_URL, falling back to individual env variables.');
    }
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQL_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'katheval_db',
    port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || process.env.MYSQLPORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const dbConfig = getResolvedDbConfig();

// In-Memory Fallback Storage if MySQL DB is offline
const inMemoryStore = {
  candidates: [
    {
      id: 1,
      candidate_code: 'KATH-2026-9001',
      full_name: 'Tariq Hassan Al-Mansoor',
      email: 'tariq.hassan@example.com',
      phone: '+971 50 123 4567',
      profession: 'Heavy Crane Operator',
      experience_years: 6,
      desired_country: 'Qatar / UAE',
      education_level: 'Vocational Diploma in Heavy Machinery',
      status: 'Pending Review',
      passport_number: 'N78945612',
      passport_full_name: 'TARIQ HASSAN AL MANSOOR',
      passport_nationality: 'Egyptian',
      passport_dob: '1990-05-14',
      passport_issue_date: '2021-03-10',
      passport_expiry_date: '2031-03-09',
      passport_place_of_issue: 'Cairo, Egypt',
      passport_additional_notes: 'Valid Gulf GCC Heavy Vehicle License Text Record #GCC-88392. Clear police background check text note.',
      cv_summary: 'Licensed crane and excavator operator with over 6 years of experience in high-rise building projects and industrial port operations.',
      cv_work_experience: '2020-2025: Lead Crane Operator at Gulf Infra Projects LLC, Doha, Qatar. Responsible for operating 50-ton crawler cranes and tower cranes.\n2018-2020: Junior Heavy Equipment Operator at Nile Contractors, Cairo, Egypt.',
      cv_education_details: '2016-2018: Diploma in Heavy Industrial Machinery Maintenance, National Technical Institute, Cairo.',
      cv_skills_list: 'Liebherr Tower Cranes, Hydraulic Excavators, Rigging Safety, Load Balancing, Preventive Maintenance, Site Safety Protocols',
      cv_certifications: 'TUV Nord Heavy Lifting Operator Certificate #99481, OSHA Safety Training Text Certificate',
      cv_languages: 'Arabic (Native), English (Working Proficiency)',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      candidate_code: 'KATH-2026-9002',
      full_name: 'Rajesh Kumar Patel',
      email: 'rajesh.patel@example.com',
      phone: '+91 98765 43210',
      profession: 'Structural MIG/TIG Welder',
      experience_years: 5,
      desired_country: 'Saudi Arabia',
      education_level: 'High School & ITI Welding Certificate',
      status: 'Interview Scheduled',
      passport_number: 'Z44321908',
      passport_full_name: 'RAJESH KUMAR PATEL',
      passport_nationality: 'Indian',
      passport_dob: '1994-08-22',
      passport_issue_date: '2022-01-15',
      passport_expiry_date: '2032-01-14',
      passport_place_of_issue: 'Mumbai, India',
      passport_additional_notes: 'ECNR Passport text verified. No active visa restrictions.',
      cv_summary: 'Certified 6G MIG and TIG Welder specializing in oil refinery pipelines and structural steel fabrication.',
      cv_work_experience: '2021-2026: Pipe Welder at Reliance Industrial Services, Gujarat, India. Worked on high-pressure steam and oil piping systems.\n2019-2021: Fabrication Assistant at Apex Steel Works.',
      cv_education_details: '2017-2019: ITI Industrial Training Institute - Welder Trade Certificate, Mumbai.',
      cv_skills_list: 'MIG Welding, TIG Welding, Arc Welding, Blueprint Reading, Pipe Fitting, Non-Destructive Testing (NDT) Knowledge',
      cv_certifications: 'ASME Section IX 6G Welder Qualification Text Record #6G-9042',
      cv_languages: 'Hindi (Native), English (Intermediate), Gujarati',
      created_at: new Date().toISOString()
    }
  ],
  employer_requests: [
    {
      id: 1,
      request_code: 'REQ-2026-4401',
      company_name: 'Al-Bahar Construction Group',
      contact_person: 'Eng. Ahmed Al-Maktoum',
      email: 'recruitment@albaharconst.com',
      phone: '+971 4 888 9900',
      industry: 'Construction',
      required_profession: 'Mason & Rebar Steel Fixer',
      workers_count: 50,
      work_location: 'Abu Dhabi, UAE',
      duration: '2 Years Contract',
      salary_offered: '$950 - $1,200 / month',
      requirements_description: 'We urgently require 30 Block Masons and 20 Rebar Fixers for commercial high-rise construction. Food, accommodation, and transport provided by company.',
      status: 'In Progress',
      created_at: new Date().toISOString()
    }
  ],
  jobs: [
    {
      id: 1,
      title: 'Heavy Equipment Operator (Excavator / Crane)',
      category: 'Construction',
      location: 'Qatar / UAE',
      vacancies: 45,
      salary_range: '$1,200 - $1,800 / mo',
      contract_period: '2 Years Renewable',
      description: 'Operate heavy construction machinery for major civil infrastructure projects.',
      requirements: 'Minimum 3 years experience, Valid heavy driving license text details required.',
      benefits: 'Free Housing, Transportation, Medical Insurance, Paid Annual Flight',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Certified MIG/TIG Welder',
      category: 'Oil & Gas',
      location: 'Saudi Arabia',
      vacancies: 30,
      salary_range: '$1,500 - $2,200 / mo',
      contract_period: '2 Years Contract',
      description: 'High pressure pipe welding and structural steel fabrication for industrial facilities.',
      requirements: '6G Welding Certification text credentials, 4+ years refinery experience.',
      benefits: 'Overtime Allowance, Food Provided, Health Cover, Flight Ticket',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Senior HVAC Technician',
      category: 'Engineering',
      location: 'Dubai, UAE',
      vacancies: 20,
      salary_range: '$1,400 - $2,000 / mo',
      contract_period: '2 Years Renewable',
      description: 'Installation, troubleshooting and repair of central commercial HVAC chillers.',
      requirements: 'HVAC Diploma text details, 3+ years Gulf experience preferred.',
      benefits: 'Accommodation, Medical, Paid Leave, End of Service Gratuity',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Hotel Staff & Room Attendants',
      category: 'Hospitality',
      location: 'Oman & Kuwait',
      vacancies: 50,
      salary_range: '$900 - $1,300 / mo',
      contract_period: '2 Years Contract',
      description: 'Providing housekeeping, guest service and facility upkeep in luxury resort hotels.',
      requirements: 'Basic English communication, customer-oriented attitude.',
      benefits: 'Free Duty Meals, Housing, Service Charge Share, Transport',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Warehouse Operations & Forklift Driver',
      category: 'Logistics',
      location: 'Saudi Arabia',
      vacancies: 60,
      salary_range: '$1,000 - $1,500 / mo',
      contract_period: '2 Years Contract',
      description: 'Inventory sorting, pallet management, forklift operation and logistics loading.',
      requirements: 'Forklift license details, physical stamina.',
      benefits: 'Accommodation, Flight allowance, Medical Cover',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
};

let pool = null;
let isConnected = false;
let reconnectTimer = null;

async function initDatabaseConnection() {
  try {
    // 1. First attempt: Direct connection to target database (ideal for Coolify and user-scoped MySQL permissions)
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    connection.release();
    isConnected = true;
    console.log(`[Database] Successfully connected to MySQL at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }

    // Auto-migrate tables
    await autoMigrateTables();
    return true;
  } catch (err) {
    // 2. If error is ER_BAD_DB_ERROR, attempt to create database if privileged
    if (err.code === 'ER_BAD_DB_ERROR') {
      try {
        console.log(`[Database] Database '${dbConfig.database}' does not exist. Attempting creation...`);
        const tempConn = await mysql.createConnection({
          host: dbConfig.host,
          user: dbConfig.user,
          password: dbConfig.password,
          port: dbConfig.port
        });
        await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await tempConn.end();

        pool = mysql.createPool(dbConfig);
        const connection = await pool.getConnection();
        connection.release();
        isConnected = true;
        console.log(`[Database] Database created and connected successfully.`);
        await autoMigrateTables();
        return true;
      } catch (createErr) {
        console.warn(`[Database Warning] Could not auto-create database: ${createErr.message}`);
      }
    }

    console.warn(`[Database Warning] MySQL connection failed (${err.message}).`);
    console.warn(`[Database Status] Operating in Resilient Storage Mode until MySQL becomes available.`);
    isConnected = false;

    // Schedule background reconnection attempts (essential for Docker / Coolify startup sequence)
    if (!reconnectTimer) {
      reconnectTimer = setInterval(async () => {
        try {
          console.log('[Database] Retrying connection to MySQL server...');
          const ok = await initDatabaseConnection();
          if (ok) {
            console.log('[Database] Reconnected to MySQL successfully!');
          }
        } catch (_) {}
      }, 7000);
    }
    return false;
  }
}

async function autoMigrateTables() {
  if (!pool || !isConnected) return;

  try {
    // Check candidate table schema guaranteed inline DDL
    await pool.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_code VARCHAR(50) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        profession VARCHAR(150) NOT NULL,
        experience_years INT DEFAULT 0,
        desired_country VARCHAR(100) DEFAULT 'Any',
        education_level VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending Review',
        passport_number VARCHAR(100) NOT NULL,
        passport_full_name VARCHAR(255) NOT NULL,
        passport_nationality VARCHAR(100) NOT NULL,
        passport_dob DATE NULL,
        passport_issue_date DATE NULL,
        passport_expiry_date DATE NULL,
        passport_place_of_issue VARCHAR(150),
        passport_additional_notes TEXT,
        cv_summary TEXT,
        cv_work_experience LONGTEXT,
        cv_education_details LONGTEXT,
        cv_skills_list TEXT,
        cv_certifications TEXT,
        cv_languages VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS employer_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        request_code VARCHAR(50) NOT NULL UNIQUE,
        company_name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        required_profession VARCHAR(150) NOT NULL,
        workers_count INT DEFAULT 1,
        work_location VARCHAR(150),
        duration VARCHAR(100),
        salary_offered VARCHAR(100),
        requirements_description TEXT,
        status VARCHAR(50) DEFAULT 'New Request',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        location VARCHAR(150) NOT NULL,
        vacancies INT DEFAULT 1,
        salary_range VARCHAR(100),
        contract_period VARCHAR(100),
        description TEXT,
        requirements TEXT,
        benefits TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Also execute external schema.sql if exists (for seeds, etc.)
    const schemaCandidatePaths = [
      path.join(__dirname, 'schema.sql'),
      path.join(__dirname, '..', 'schema.sql')
    ];

    for (const schemaPath of schemaCandidatePaths) {
      if (fs.existsSync(schemaPath)) {
        const sqlContent = fs.readFileSync(schemaPath, 'utf8');
        const statements = sqlContent
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

        for (const statement of statements) {
          try {
            await pool.query(statement);
          } catch (_) {
            // Ignore duplicate entries on seeds
          }
        }
        break;
      }
    }

    console.log('[Database] MySQL tables (candidates, employer_requests, jobs) verified and ready.');
  } catch (err) {
    console.error('[Database Migration Error]', err.message);
  }
}

// Database query helper
async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error('[MySQL Query Error]', err.message);
      throw err;
    }
  }
  return null;
}

module.exports = {
  initDatabaseConnection,
  query,
  getIsConnected: () => isConnected,
  getDbConfig: () => ({ ...dbConfig, password: '***' }),
  inMemoryStore
};

