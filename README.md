# Dental Clinic Platform (Web + Mobile + API)

This repository now includes a complete starter architecture for a **dental clinic management solution** with:

- **Node.js + Express backend**
- **MySQL database**
- **React web app**
- **React Native (Expo) mobile app**

## Main Features Implemented

1. **Login & registration** for `patient`, `doctor`, and `clinic`
2. **Scheduling appointments**
3. **Patient dashboard** showing upcoming appointments
4. **Request virtual consultation** on an appointment

---

## Project Structure

- `backend/` → Node.js API + MySQL schema
- `web/` → React web client
- `mobile/` → React Native mobile client (Expo)

---

## Backend setup (`backend/`)

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Fill `.env` with your MySQL credentials.

### 3) Initialize database

Run the SQL script in your MySQL server:

```sql
SOURCE schema.sql;
```

### 4) Start API server

```bash
npm run dev
```

Backend endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/appointments`
- `GET /api/appointments/patient/:patientId`
- `POST /api/appointments/virtual-consultation`

---

## Web setup (`web/`)

```bash
cd web
npm install
npm start
```

Optional environment variable:

- `REACT_APP_API_BASE_URL` (default: `http://localhost:5000/api`)

---

## Mobile setup (`mobile/`)

```bash
cd mobile
npm install
npm start
```

Optional environment variable:

- `EXPO_PUBLIC_API_BASE_URL` (default: `http://localhost:5000/api`)

> For physical devices, replace `localhost` with your machine IP.

---

## Notes

- This is a production-ready **starter foundation**. You should add:
  - input validation (e.g., Zod/Joi)
  - robust error handling
  - refresh tokens and secure storage
  - role-based dashboards for doctor and clinic
  - video provider integration (Zoom/Twilio/Agora) for live consultations
