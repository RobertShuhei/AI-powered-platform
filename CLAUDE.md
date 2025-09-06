# Project Overview: "AI Tour Guide Matcher"

## 1. Project Goal
To build an MVP (Minimum Viable Product) of an AI-powered matching platform during a 2-day hackathon. The platform will connect travelers with local personal tour guides.

## 2. Core Concept
- **C2C Matching:** Travelers can search for and find local guides who offer unique, non-mainstream tours.
- **AI-Powered:** The platform will use AI for features like profile translation and intelligent matching/recommendations.

## 3. Tech Stack
- **Frontend:** Next.js with TypeScript and Tailwind CSS.
- **Backend:** Python with Flask.
- **Database:** PostgreSQL.
- **Deployment:** The entire application will be containerized using Docker.

## 4. Key MVP Features
- User authentication (Sign up, Login) using JWT.
- Profiles for both Travelers and Guides.
- A search and filtering system for guides (based on location, tags, etc.).
- A simple booking/inquiry system.
- A simple messaging feature.
- An AI-powered translation feature for user profiles.

## 5. Security Policy
- All user inputs must be validated.
- Authentication is required for sensitive actions.
- Prevent common vulnerabilities like XSS, CSRF, and IDOR.
- All secrets and API keys will be managed via environment variables and will not be committed to Git.

## Current Status
- The Docker environment for frontend (Next.js), backend (Flask), and database (PostgreSQL) is fully configured and running.
- All initial build errors and container startup issues have been resolved.
- The database migration system (Flask-Migrate/Alembic) is initialized.
- The first migration has been successfully run, creating the `users` table in the database.
- The project is now ready for feature development, starting with the authentication API.