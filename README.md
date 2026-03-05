# Dental Clinic Platform (Web + Mobile + API)

Full-stack starter architecture for a **dental clinic management platform**:

- **Node.js + Express backend**
- **MySQL database**
- **React web app**
- **React Native (Expo) mobile app**

## Implemented Features

1. Login/registration for `patient`, `doctor`, and `clinic`
2. Appointment scheduling
3. Patient dashboard (upcoming appointments)
4. Virtual consultation request
5. Input validation with **Joi**
6. Centralized robust error handling
7. Access/refresh token flow with refresh token revocation
8. Role-based dashboards for patient, doctor, and clinic (web + mobile)

## Project Structure

- `backend/` → Node.js API, validation, auth, MySQL schema
- `web/` → React web client
- `mobile/` → React Native mobile app (Expo)

## Backend setup (`backend/`)

```bash
cd backend
npm install
cp .env.example .env
```

Run MySQL schema:

```sql
SOURCE schema.sql;
```

Start API:

```bash
npm run dev
```

### Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Appointment endpoints

- `POST /api/appointments`
- `GET /api/appointments/patient/:patientId`
- `GET /api/appointments/doctor/me`
- `GET /api/appointments/clinic/me`
- `POST /api/appointments/virtual-consultation`

## Web setup (`web/`)

```bash
cd web
npm install
npm start
```

Optional env:

- `REACT_APP_API_BASE_URL` (default `http://localhost:5000/api`)

## Mobile setup (`mobile/`)

```bash
cd mobile
npm install
npm start
```

Optional env:

- `EXPO_PUBLIC_API_BASE_URL` (default `http://localhost:5000/api`)

Mobile refresh tokens are saved in **Expo SecureStore**.

## Security notes

- Refresh tokens are hashed before DB storage (`refresh_tokens` table).
- Web uses `httpOnly` cookie for refresh token and in-memory access token.
- Mobile stores refresh token in secure encrypted storage.
