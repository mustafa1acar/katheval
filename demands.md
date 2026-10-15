# Katheval Manpower Supply (katheval.al) - Project Requirements & Specifications

## Overview
Katheval Manpower Supply is a comprehensive workforce solution platform designed for labor supply, recruitment, and manpower distribution across various industries (Construction, Hospitality, Oil & Gas, Healthcare, Logistics, etc.). Official domain: katheval.al.

## Key Requirements & Business Rules
1. **No Payment System**: The platform operates without any online checkout, subscriptions, or payment gateways.
2. **No File Upload System**: No PDF/DOC/image uploads for CVs or Passports.
3. **Text-Based CV & Passport Records**: All candidate information (Resume/CV, Work Experience, Education, Skills, and Passport Details) is entered directly into structured text fields and stored as text (`TEXT`/`LONGTEXT` / `JSON`) in MySQL.
4. **Database**: MySQL database integration with automated table initialization (`schema.sql`) and resilient fallback mode.
5. **Branding**: Uses official branding with `logo.jpeg`.
6. **Core Portals**:
   - **Public Portal**: Company Services, Industry Supply, Available Vacancies, Candidate Application (CV & Passport Text forms), Employer Manpower Request.
   - **Candidate Portal**: Text-based CV builder & Passport record manager with tracking reference.
   - **Admin Portal**: Candidate search, Passport & CV text viewer, Manpower Request management, Job Posting manager, Database status monitor.
