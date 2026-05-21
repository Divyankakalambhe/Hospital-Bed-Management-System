

































Claim offer
Hey gpt here is project act as a senior software engineer in hospital management system help me to create a PRD A real-time dashboard for hospital administrators in 2026 and for next generation to track bed availability acrosswards, manage patient admissions and discharges, assign beds based onpatient condition/gender/ward type, and generate occupancy reports. Includesrole-based access for doctors, nurses, and admins, live status updates, and alertsystem for critical bed shortages. And give me in markdown file means MD system for critical bed shortage and used this stack React, Node.js, Supabase, Socket.io, React Query, Recharts it's a real world challenge output for copy the text in antigravity prd.md file                    
Role : Act as a senior software engineer having experience 20 years + in hospital management system                     
                    
Task : Create website for Hospital Bed Management                    
                    
Content : A real-time dashboard for hospital administrators to track bed availability across
                    
wards, manage patient admissions and discharges, assign beds based on
                    
patient condition/gender/ward type, and generate occupancy reports. Includes
                    
role-based access for doctors, nurses, and admins, live status updates, and alert
                    
system for critical bed shortages                    
                    
Constraint : Use this stack React, Node.js,Supabase, Socket.io, React Query, Recharts  . I don't have demo registration . during after the discharge the occupied bed shown in available I have fully work full website    add some dummy information in backend chart       don't use postgresql   , typescript     instead of use Supabase ,JavaScript, vite 
                    
Output : In PRD  for copy markdown file in markdown file 8 Have  

Hospital Bed Management System – PRD (2026 Edition)
Project Title
SmartBed AI – Real-Time Hospital Bed Management System

1. Project Overview
Introduction
SmartBed AI is a next-generation hospital bed management platform designed for hospitals in 2026. The system provides real-time monitoring of hospital bed availability across multiple wards and departments. It helps hospital administrators, doctors, nurses, and reception staff efficiently manage patient admissions, discharges, and bed allocation while reducing delays and operational confusion.

The platform includes:

Real-time bed tracking

Live occupancy dashboards

Emergency shortage alerts

Role-based access

Bed assignment automation

Occupancy analytics

Ward management

Live Socket.io updates

Data visualization using Recharts

The system is built using:

React + Vite (Frontend)

Node.js + Express (Backend)

Supabase (Database & Authentication)

Socket.io (Real-time communication)

React Query (API state management)

Recharts (Analytics dashboard)

JavaScript (No TypeScript)

2. Problem Statement
Hospitals often face problems such as:

Manual bed tracking

Delayed patient admissions

No real-time bed visibility

Bed assignment conflicts

Emergency overcrowding

Lack of centralized dashboard

Slow communication between departments

Difficulty tracking ICU and emergency beds

This project solves these issues using a centralized real-time digital system.

3. Objectives
Primary Goals
Track hospital beds in real time

Manage admissions and discharges

Automatically update bed availability

Provide ward-wise occupancy reports

Send alerts during critical bed shortages

Improve hospital operational efficiency

Secondary Goals
Reduce paperwork

Improve emergency response

Provide analytical reports

Improve patient flow management

Enable multi-role secure access

4. Tech Stack
Technology	Purpose
React + Vite	Frontend UI
Node.js + Express	Backend APIs
Supabase	Database + Authentication
Socket.io	Real-time updates
React Query	Data fetching & caching
Recharts	Dashboard charts
JavaScript	Application language
Tailwind CSS	UI Styling
5. User Roles
Admin
Permissions
Manage hospital wards

Add/Edit/Delete beds

View all reports

Monitor live occupancy

Manage users

Configure alerts

Doctor
Permissions
View available beds

Request bed assignments

View patient status

Check ICU availability

Nurse
Permissions
Update patient discharge status

Mark beds as occupied/available

View assigned ward beds

Receptionist
Permissions
Admit patients

Register patient details

Assign available beds

View bed status

6. Core Features
6.1 Authentication System
Features
Supabase Authentication

Secure login/logout

Role-based access

Protected routes

Session management

Login Fields
Hospital Name

Email

Password

Role

6.2 Real-Time Bed Dashboard
Dashboard Capabilities
Total beds

Occupied beds

Available beds

ICU occupancy

Emergency ward status

Gender-wise bed tracking

Ward-wise occupancy

Real-Time Features
Socket.io live updates

Instant occupancy refresh

Auto-refresh charts

Live patient movement tracking

6.3 Bed Management Module
Bed Status Types
Available

Occupied

Cleaning

Maintenance

Reserved

Emergency Locked

Bed Assignment Logic
Beds are assigned based on:

Patient condition

Gender

Ward type

ICU requirement

Emergency priority

6.4 Patient Admission System
Features
Add patient details

Assign ward

Assign bed

Emergency admission

Generate admission ID

Patient Fields
Patient Name

Age

Gender

Disease

Admission Date

Ward Type

Assigned Doctor

6.5 Patient Discharge System
Features
Discharge patient

Auto free occupied bed

Generate discharge summary

Update occupancy instantly

Important Workflow
After discharge:

Patient status becomes discharged

Occupied bed changes to available

Dashboard updates automatically

Socket.io emits live update

Reports refresh instantly

6.6 Critical Bed Shortage Alert System
Alert Triggers
ICU beds below 10%

Emergency beds full

Total occupancy above 90%

Oxygen beds unavailable

Alert Types
Real-time notifications

Dashboard warnings

Audio alerts

Color-coded emergency banners

Alert Priorities
Priority	Condition
Low	70% occupancy
Medium	85% occupancy
High	95% occupancy
Critical	No beds available
7. Analytics & Reporting
Recharts Dashboard Charts
Charts Included
Ward Occupancy Pie Chart

Monthly Admission Bar Chart

ICU Usage Line Graph

Gender Distribution Chart

Bed Availability Trend Graph

Reports
Daily occupancy report

Monthly hospital statistics

ICU utilization report

Bed turnover report

Emergency admission report

8. System Architecture
Frontend Architecture (React + Vite)
Pages
Login Page

Dashboard

Bed Management

Patient Admission

Patient Discharge

Reports

Alerts Panel

User Management

Backend Architecture (Node.js)
API Modules
Authentication API

Bed API

Patient API

Reports API

Alerts API

Ward API

Database Structure (Supabase)
Tables
users
Field	Type
id	uuid
name	text
email	text
role	text
beds
Field	Type
id	uuid
ward	text
type	text
status	text
gender	text
patients
Field	Type
id	uuid
name	text
disease	text
status	text
bed_id	uuid
admissions
Field	Type
id	uuid
patient_id	uuid
admission_date	timestamp
discharge_date	timestamp
9. Real-Time Workflow Using Socket.io
Workflow
Patient admitted

Bed status changes

Backend emits Socket event

Frontend receives update

Dashboard refreshes instantly

Charts update live

10. React Query Usage
Purpose
API caching

Auto data refresh

Background synchronization

Optimistic UI updates

Reduced API calls

11. UI/UX Design
Theme
Modern hospital UI

Dark mode + Light mode

Responsive design

Mobile-friendly dashboard

Clean admin panels

Dashboard Design
Live counters

Circular progress charts

Animated statistics

Real-time activity feed

12. Dummy Data for Charts
Example Data
const wardOccupancy = [
  { ward: "ICU", occupied: 18, available: 2 },
  { ward: "General", occupied: 60, available: 40 },
  { ward: "Emergency", occupied: 15, available: 5 },
  { ward: "Pediatric", occupied: 20, available: 10 },
];
13. API Endpoints
Authentication
POST /api/auth/login
POST /api/auth/logout
Beds
GET /api/beds
POST /api/beds
PUT /api/beds/:id
Patients
POST /api/patients/admit
PUT /api/patients/discharge/:id
GET /api/patients
14. Folder Structure
hospital-bed-management/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── charts/
│   │   └── socket/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── socket/
│   └── config/
15. Future Scope (2026+)
AI Features
AI bed prediction system

Smart emergency allocation

Patient risk prediction

Voice-enabled dashboard

AI occupancy forecasting

Advanced Features
Multi-hospital support

Ambulance integration

Government health API integration

QR-based patient tracking

Mobile app support

16. Security Features
JWT Authentication

Supabase secure policies

Role-based authorization

API validation

Encrypted credentials

Secure session handling

17. Performance Optimization
React Query caching

Lazy loading

Socket connection optimization

Optimized chart rendering

API pagination

18. Conclusion
SmartBed AI is a modern real-time hospital bed management system designed for next-generation healthcare infrastructure. The platform improves operational efficiency, reduces emergency delays, automates bed allocation, and provides live analytics using real-time technologies.

The system is scalable, responsive, secure, and production-ready using:

React + Vite

Node.js

Supabase

Socket.io

React Query

Recharts

JavaScript

This project solves real-world hospital management challenges and provides a complete digital solution for hospital bed operations in 2026.


