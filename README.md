SHEild 🛡️

A women's safety web app: one-press SOS with live location, trusted emergency contacts, and a private alert history.

Next.js React Spring Boot MySQL Tailwind CSS

🔗 Live demo: sheild-nine.vercel.app  (runs in demo mode with sample data, login demo@sheild.pk / demo1234)

<img width="942" height="442" alt="image" src="https://github.com/user-attachments/assets/414b511e-cacb-45ea-8f2e-e6e1ae27c85e" />
<img width="947" height="440" alt="image" src="https://github.com/user-attachments/assets/dbae4bf6-fbbe-448b-bca9-09bf0c92581e" />
<img width="677" height="416" alt="image" src="https://github.com/user-attachments/assets/4a9c2138-7361-49a1-8576-69866bc8674c" />
<img width="931" height="415" alt="image" src="https://github.com/user-attachments/assets/6c08b29f-739b-4093-8f0a-aa60d1df232a" />

Why I built this

Many girls and women in Pakistan and everywhere else, think twice before taking a late taxi, waiting at a bus stop, or walking home alone. In a frightening moment, finding your phone, unlocking it, opening the right app and typing a message takes time you may not have.

I built SHEild because I wanted to shrink that moment to one press. The idea is simple: you set up the people you trust once, and when something feels wrong, a single tap records an alert with your location. No menus, no typing.

This project took me about three months to build. I'm a student who was new to full-stack development when I started. I designed the database, wrote the Spring Boot REST API, built the interface, and then connected everything together. The goal was never only a portfolio piece. I wanted to build something that could genuinely help someone feel safer.

Features
🚨 One-press SOS: trigger an alert instantly from the SOS screen
📍 Live location: your coordinates are captured with every alert using the browser's geolocation
👥 Trusted contacts: add, view and remove the people who should be reached in an emergency, with a primary contact
🕘 Private alert history: every alert with its time, location and status (Active, Resolved, Cancelled)
🔐 Secure accounts: passwords are hashed with BCrypt and never stored in plain text
📞 Pakistan helplines built in: quick access to Police (15), Rescue 1122, Edhi (115) and the Women Helpline (1043)
📱 Responsive design: works on phones, since a safety tool must be usable on the device you carry
🧪 Demo mode: the frontend runs on built-in sample data when no backend is connected, so anyone can try it instantly


Architecture
┌──────────────┐   HTTP / JSON    ┌───────────────────┐    JPA     ┌─────────┐
│   Next.js    │ ───────────────► │   Spring Boot     │ ─────────► │  MySQL  │
│  (frontend)  │ ◄─────────────── │   REST API        │ ◄───────── │ sheild_ │
│  port 3000   │                  │   port 8080       │            │   db    │
└──────────────┘                  └───────────────────┘            └─────────┘

Database

Tables: users, emergency_contacts, sos_events (plus user_profiles, notifications, safety_reports and emergency_services designed for future features). Foreign keys cascade on delete, and CHECK constraints keep statuses valid, for example an SOS can only be ACTIVE, RESOLVED or CANCELLED.

Getting started (full stack, locally)
Prerequisites
Java 21+
Node.js 20+
MySQL 8
1. Database
bash
mysql -u root -p -e "CREATE DATABASE sheild_db;"
mysql -u root -p sheild_db < database/schema.sql
2. Backend
bash
cd SHEild_backend

# Windows (Command Prompt)
set DB_PASSWORD=your_mysql_password
mvnw.cmd spring-boot:run

# Mac / Linux
export DB_PASSWORD=your_mysql_password
./mvnw spring-boot:run

The API starts on http://localhost:8080.

3. Frontend
bash
cd SHEild_frontend
cp .env.local.example .env.local     # Windows: copy .env.local.example .env.local
npm install
npm run dev

Open http://localhost:3000, create an account, add a contact and press SOS.

Demo mode (no backend needed)

Skip .env.local and the frontend runs on sample data. Log in with demo@sheild.pk / demo1234.

API reference
Method	Endpoint	Description
POST	/api/users	Register a new user
POST	/api/auth/login	Log in
GET	/api/emergency-contacts/{userId}	List a user's contacts
POST	/api/emergency-contacts/{userId}	Add a contact
DELETE	/api/emergency-contacts/{userId}/{contactId}	Remove a contact
POST	/api/sos/{userId}	Trigger an SOS
GET	/api/sos/{userId}	Get SOS history
PUT	/api/sos/{userId}/{sosId}/end?status=RESOLVED|CANCELLED	End an SOS

A user can only have one active SOS at a time, and the API returns clear error messages such as Email is already registered.

What I learned
Designing a relational database with constraints and relationships, then mapping it to JPA entities
Building a layered REST API in Spring Boot and handling errors cleanly
Password hashing and why plain-text passwords must never be stored or committed
Making a frontend and backend talk to each other: CORS, JSON contracts and adapters
Building a responsive interface with Next.js and Tailwind
Debugging across three layers (browser, API, database), and using Git/GitHub properly
Roadmap

This is a working foundation, and I'm honest about what's still to come:

 JWT authentication (currently the user id acts as the session)
 Real notifications: send SMS / WhatsApp with a live-location link to contacts when an SOS fires
 Store full name and city in the database (currently kept in the browser)
 Contact edit endpoint (edit currently works as delete + re-add)
 Deploy the backend (Render / Railway with hosted MySQL)
 Shake-to-trigger and voice-trigger SOS
 Urdu language support
 Mobile app version
⚠️ Important disclaimer

SHEild is a student project and not a replacement for emergency services. In danger, always call your local emergency number first:

Service	Number
Police	15
Rescue	1122
Edhi Ambulance	115
Women Helpline (Punjab)	1043

Author

Aymen Faisal 🔗 linkedin.com/in/aymen-faisal-0b58ab377 
Email  aymenfaisal30@gmail.com

Built with a lot of persistence and a lot of chai, to help girls feel safer. 💜





