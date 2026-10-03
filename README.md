# SHEild 🛡️

A women's-safety web app: one-tap **SOS alerts with live location**, **emergency contacts**, and **alert history**.

- **Frontend:** Next.js 16, React 19, Tailwind CSS (`/frontend`)
- **Backend:** Spring Boot 4, Spring Security (BCrypt), JPA/Hibernate (`/backend`)
- **Database:** MySQL 8 (`/database/schema.sql`)

> **Live demo:** _add your Vercel link here_ (the demo runs without a server, using sample data)

## Run it locally (full stack)

### 1. Database
Install MySQL 8, then:
```
mysql -u root -p -e "CREATE DATABASE sheild_db;"
mysql -u root -p sheild_db < database/schema.sql
```

### 2. Backend (needs Java 21+)
```
cd backend
# Windows (PowerShell):  $env:DB_PASSWORD="your_mysql_password"
# Mac/Linux:             export DB_PASSWORD=your_mysql_password
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```
API runs on http://localhost:8080

### 3. Frontend (needs Node 20+)
```
cd frontend
copy .env.local.example .env.local      # Mac/Linux: cp .env.local.example .env.local
npm install
npm run dev
```
Open http://localhost:3000, sign up, add a contact, press SOS.

### Demo mode (no backend)
Skip `.env.local` and the site runs on built-in sample data (login: `demo@sheild.pk` / `demo1234`).

## API (backend)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users` | Register |
| POST | `/api/auth/login` | Login |
| GET/POST | `/api/emergency-contacts/{userId}` | List / add contacts |
| DELETE | `/api/emergency-contacts/{userId}/{contactId}` | Remove contact |
| POST | `/api/sos/{userId}` | Trigger SOS |
| GET | `/api/sos/{userId}` | SOS history |
| PUT | `/api/sos/{userId}/{sosId}/end?status=RESOLVED\|CANCELLED` | End SOS |

## Roadmap / known limitations
- [ ] JWT authentication (currently the user id acts as the session)
- [ ] Real SMS/WhatsApp notifications to contacts when SOS fires
- [ ] Store full name & city in the database (currently kept in the browser)
- [ ] Contact edit endpoint (edit currently = delete + re-add)
- [ ] Deploy backend (Render/Railway + hosted MySQL)
