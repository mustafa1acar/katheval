-- Katheval Manpower Supply Database Schema
-- Database: katheval_db

-- 1. Candidates Table (Job Applications with Text-based CV & Passport Information)
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
    
    -- PASSPORT INFORMATION (TEXT ONLY)
    passport_number VARCHAR(100) NOT NULL,
    passport_full_name VARCHAR(255) NOT NULL,
    passport_nationality VARCHAR(100) NOT NULL,
    passport_dob DATE NULL,
    passport_issue_date DATE NULL,
    passport_expiry_date DATE NULL,
    passport_place_of_issue VARCHAR(150),
    passport_additional_notes TEXT,
    
    -- CV INFORMATION (TEXT ONLY)
    cv_summary TEXT,
    cv_work_experience LONGTEXT,
    cv_education_details LONGTEXT,
    cv_skills_list TEXT,
    cv_certifications TEXT,
    cv_languages VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Employer Manpower Requests Table
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

-- 3. Job Openings / Vacancies Table
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

-- Seed Initial Job Vacancies if empty
INSERT IGNORE INTO jobs (id, title, category, location, vacancies, salary_range, contract_period, description, requirements, benefits)
VALUES 
(1, 'Heavy Equipment Operator (Excavator / Crane)', 'Construction', 'Qatar / UAE', 45, '$1,200 - $1,800 / mo', '2 Years Renewable', 'Operate heavy construction machinery for major civil infrastructure projects.', 'Minimum 3 years experience, Valid heavy driving license text details required.', 'Free Housing, Transportation, Medical Insurance, Paid Annual Flight'),
(2, 'Certified MIG/TIG Welder', 'Oil & Gas', 'Saudi Arabia', 30, '$1,500 - $2,200 / mo', '2 Years Contract', 'High pressure pipe welding and structural steel fabrication for industrial facilities.', '6G Welding Certification text credentials, 4+ years refinery experience.', 'Overtime Allowance, Food Provided, Health Cover, Flight Ticket'),
(3, 'Senior HVAC Technician', 'Engineering', 'Dubai, UAE', 20, '$1,400 - $2,000 / mo', '2 Years Renewable', 'Installation, troubleshooting and repair of central commercial HVAC chillers.', 'HVAC Diploma text details, 3+ years Gulf experience preferred.', 'Accommodation, Medical, Paid Leave, End of Service Gratuity'),
(4, 'Hotel Staff & Room Attendants', 'Hospitality', 'Oman & Kuwait', 50, '$900 - $1,300 / mo', '2 Years Contract', 'Providing housekeeping, guest service and facility upkeep in luxury resort hotels.', 'Basic English communication, customer-oriented attitude.', 'Free Duty Meals, Housing, Service Charge Share, Transport'),
(5, 'Warehouse Operations & Forklift Driver', 'Logistics', 'Saudi Arabia', 60, '$1,000 - $1,500 / mo', '2 Years Contract', 'Inventory sorting, pallet management, forklift operation and logistics loading.', 'Forklift license details, physical stamina.', 'Accommodation, Flight allowance, Medical Cover');
