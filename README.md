# Dental Clinic Platform (Web + Mobile + API)

Full-stack starter architecture for a **dental clinic management platform**:

- **Node.js + Express backend**
- **MySQL database**
- **React web app**
- **React Native (Expo) mobile app**

## Implemented Features

1. Login/registration for `patient`, `doctor`, and `clinic`
2. Appointment scheduling
3. Patient dashboard (upcoming appointments with date, doctor, confirmation status)
4. Patient prescription card/data
5. Virtual consultation request
6. Input validation with **Joi**
7. Centralized robust error handling
8. Access/refresh token flow with refresh token revocation
9. Role-based dashboards for patient, doctor, and clinic (web + mobile)

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


### MySQL access denied error

If you see `Access denied for user ... (using password: YES)`, your API credentials do not match MySQL.

1. Create/update `backend/.env` with valid values for `DB_USER` and `DB_PASSWORD`.
2. Create a dedicated MySQL user (recommended):

```sql
CREATE USER IF NOT EXISTS 'dental_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON dental_clinic.* TO 'dental_app'@'localhost';
FLUSH PRIVILEGES;
```

3. Restart the backend after updating `.env`.

The server now performs a DB connection check at startup and prints a clear message when credentials are wrong.
