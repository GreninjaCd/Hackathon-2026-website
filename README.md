Hackathon 2026 – Full Stack Web Application
Assignment Submission Report
Detail
Value
Submitted by
2312025,2312002,2312074,2312178,2312179
2312183,2312114,2312130
Course/Dept.
CSE, NIT Silchar
Live Website
https://hackathon-frontend1-iy6j.onrender.com/
Tech Stack
MERN (MongoDB, Express.js, React.js, Node.js)
Repository
gauravghosh24/hackathon-2026-website: Project for CS 304 to build the Hackathon 2026 online system.

1. Project Overview
This project is a fully functional Hackathon Management System designed for Hackathon 2026, a national-level event. The system provides a centralized platform for all event phases, from registration to final certificate distribution.
The system successfully supports:
User registration and secure authentication.
Team creation, joining, and management.
Online quiz rounds with timed submission and auto-evaluation.
Payment upload and administrative verification.
Admin dashboard for full event oversight.
Live leaderboard system based on score and submission time.
Integration with MongoDB Atlas for cloud database management.
2. Objectives
The primary objectives for this project were to create a scalable, secure, and complete platform that fulfills all the operational requirements of a real-world hackathon:
Scalability: Create a scalable, real-world event management system.
Security: Implement a secure, JWT-based authentication mechanism using bcrypt for password hashing.
Workflow: Manage teams, members, payments, and quiz submissions through dedicated APIs.
Control: Provide an admin-only panel with role-based access control for full event monitoring.
Deployment: Deploy both frontend and backend on cloud platforms (Render).
3. System Architecture
The project follows a standard Client–Server Architecture utilizing the MERN stack.
3.1 Frontend (Client) – React
The client is a single-page application (SPA) responsible for the user interface, routing, and communication with the API.
Technologies: React.js, TailwindCSS, Axios.
Design: Custom UI Components built with a Cyberpunk theme.
3.2 Backend (Server) – Node.js/Express.js
The backend is a RESTful API, managing business logic, data persistence, and security.
Technologies: Node.js, Express.js, Mongoose, Multer, JWT, Bcrypt.
Functionality: Authentication, data validation, file uploads (/uploads), centralized error handling, and role-based access control.
3.3 Database – MongoDB Atlas
MongoDB Atlas is used as the flexible, cloud-hosted document database.
Collections: Users, Teams, Questions, Submissions, Payments, and Certificates.
4. Features Implemented
Feature Area
Description
User Access
Register, secure Login (JWT), and role-based authorization.
Team Management
Create/Join teams, view team members, and check payment status.
Quiz Engine
Timed, multi-round quiz functionality with immediate submission validation.
Admin Control
Dashboard to Verify Payments, Manage Quiz Questions, and Upload Certificate templates.
Data Visibility
Live Leaderboard sorted by score and submission time.
Technical
File upload for payment proofs (Multer) and centralized global error handling middleware.

5. ER Diagram (MongoDB Collections)
The primary data relationships are defined across five core MongoDB collections:
Collection
Key Fields
Relationships
User
_id, name, email, role, teamId
1:1 with Team (via teamId reference)
Team
_id, name, leaderId, members, paymentProof
1:N with Users (via leaderId and members array)
Question
_id, round, text, options, correctAnswer
None (Static data for Quiz)
Submission
_id, teamId, round, score, completionTime
N:1 with Team (via teamId reference)
Payment
_id, teamId, amount, proofUrl, status
1:1 with Team (via teamId reference)

6. API Documentation (Key Endpoints)
The API is structured around resource routes. All endpoints are protected by appropriate middleware for authentication (/api/auth) or role verification (/api/admin).
Route Group
Endpoint
Method
Functionality
Authentication
/api/auth/register
POST
Create a new user account.


/api/auth/login
POST
Authenticate user and return a JWT.
Teams
/api/teams/create
POST
Create a new team (requires authentication).


/api/teams/:id
GET
Get details for a specific team.
Quiz
/api/quiz/questions/:round
GET
Fetch questions for a specific round.


/api/quiz/submit
POST
Submit quiz answers for scoring.
Submissions
/api/submissions/leaderboard
GET
Retrieve the global leaderboard.
Admin
/api/payments/verify/:id
PUT
Admin only: Mark a team's payment as verified.


/api/download/participants
GET
Admin only: Download all team data.

7. Deployment Links
Component
URL
Host
Frontend
https://hackathon-frontend1-iy6j.onrender.com
Render
Backend API
https://www.google.com/search?q=https://hackathon-backend1-akuo.onrender.com
Render

Database is hosted on MongoDB Atlas (Cloud).
8. How to Run the Project Locally
Step 1: Clone the project
git clone [https://github.com/gauravghosh24/hackathon-2026-website.git](https://github.com/gauravghosh24/hackathon-2026-website.git)


Step 2: Install dependencies
# Frontend
cd client
npm install
npm run dev

# Backend
cd ../server
npm install
npm start


Step 3: Create .env file (Backend)
Create a file named .env in the server/ directory:
PORT=5000
MONGODB_URI=<Your MongoDB Atlas Connection String>
JWT_SECRET=a_strong_secret_key_for_jwt


9. Conclusion
The Hackathon 2026 website is a complete, production-level MERN application that successfully demonstrates proficiency in: Cloud deployment, secure authentication, database management, event workflow design, and full-stack integration. It meets all academic requirements and provides a robust, scalable solution for real hackathon needs.
