# MemorySaathi – Deployment Plan

## 1. Deployment Decision

### Proposed production architecture

MemorySaathi will use a simple three-part deployment:

    User Browser
         |
         | HTTPS
         v
    Cloudflare Pages
    Frontend
    HTML / CSS / Vanilla JS
         |
         | HTTPS REST API
         v
    Render
    Spring Boot Backend
         |
         | MySQL connection
         v
    Railway
    MySQL Database

### Selected deployment targets

| Component | Deployment Target | Technology |
|---|---|---|
| Frontend | Cloudflare Pages | HTML/CSS/Vanilla JS |
| Backend | Render Web Service | Java + Spring Boot |
| Database | Railway MySQL | MySQL |
| Communication | HTTPS REST API | HTTP/JSON |
| Authentication | Existing Spring HTTP session | Cookie-based session |

This architecture is intentionally simple and suitable for a college-level
SIH prototype.

No Kubernetes, microservices, service mesh, or unnecessary DevOps tooling
will be used.

---

# 2. Production URLs

The team must record the actual production URLs after deployment.

## Frontend

Production frontend URL:

    _________________________________

Example format:

    https://<project-name>.pages.dev

## Backend

Production backend URL:

    _________________________________

Example format:

    https://<project-name>.onrender.com

## Database

MySQL host:

    _________________________________

MySQL port:

    _________________________________

Database name:

    dementia_app

The database itself is not publicly exposed through a browser.

---

# 3. Frontend Hosting

The frontend contains only:

- HTML
- CSS
- Vanilla JavaScript

It does not require a Node.js server.

The `frontend/` directory will be deployed as a static website using
Cloudflare Pages.

The frontend will communicate with the Spring Boot backend through HTTPS
REST API requests.

The frontend must not contain:

- MySQL credentials
- database passwords
- BCrypt passwords
- private API keys
- Gemini API keys
- other backend secrets

---

# 4. Backend Hosting

The Spring Boot application will be deployed as a Render Web Service.

The backend will run the existing Java Spring Boot application.

The backend is responsible for:

- REST APIs
- authentication
- session handling
- validation
- database access
- emergency event recording
- caregiver operations

The backend will connect to MySQL using the production database credentials
stored as environment variables.

---

# 5. MySQL Hosting

The production database will be hosted on Railway MySQL.

Database name:

    dementia_app

The team must obtain the production MySQL connection details from the
database provider.

Required values:

    DB_HOST
    DB_PORT
    DB_NAME
    DB_USERNAME
    DB_PASSWORD

These values must never be committed to Git.

---

# 6. Required Environment Variables

## Backend

The following production environment variables are required.

### Database

    DB_HOST
    DB_PORT
    DB_NAME
    DB_USERNAME
    DB_PASSWORD

The Spring Boot datasource configuration must use these values instead of
hardcoded production credentials.

### Emergency contact

    EMERGENCY_CONTACT_NAME
    EMERGENCY_CONTACT_PHONE

These values must contain the team's actual configured emergency contact
information.

Do not invent an emergency number.

### Future AI integration

If the Gemini chatbot is enabled later, its API key must be stored only as
a backend secret.

Example:

    GEMINI_API_KEY

For the existing cross-origin session design, configure:

    APP_CORS_ALLOWED_ORIGINS=https://<project-name>.pages.dev
    SESSION_COOKIE_SAME_SITE=None
    SESSION_COOKIE_SECURE=true

The key must never be placed in frontend JavaScript.

---

# 7. Frontend API URL

The deployed frontend must communicate with the deployed Spring Boot
backend rather than:

    http://localhost:8080

Production API base URL:

    _________________________________

Example format:

    https://<backend-name>.onrender.com

The team must update the frontend API configuration only after the
deployment target has been selected and the backend production URL is known.

The production frontend must never depend on localhost.

---

# 8. CORS

The frontend and backend will normally have different origins.

Therefore the Spring Boot backend must allow requests from the exact
production frontend origin.

Example:

    https://<project-name>.pages.dev

CORS must NOT use:

    *

for credentialed requests.

Because the current application uses an HTTP session for caregiver
authentication, credentialed browser requests must be configured correctly.

The backend should allow:

- the production frontend origin
- required HTTP methods
- required headers
- credentials

Only the required production origin should be allowed.

The local development origin may be allowed separately during development
if needed.

CORS configuration must be tested after deployment.

---

# 9. HTTPS

All production communication must use HTTPS.

Required:

    Frontend -> Backend: HTTPS
    Backend -> Database: secure database connection where supported

The production frontend URL must use:

    https://

The production backend URL must use:

    https://

The application must not be deployed with HTTP-only production URLs.

HTTPS is especially important because caregiver authentication uses a
session cookie.

---

# 10. Authentication and Sessions

The existing prototype uses Spring HTTP sessions.

The production deployment must preserve the session cookie between the
frontend and backend.

Because the frontend and backend are hosted on different domains, the team
must verify:

1. Login succeeds.
2. The browser receives the session cookie.
3. Credentialed API requests send the session cookie.
4. `/api/auth/me` recognizes the logged-in caregiver.
5. Protected caregiver endpoints recognize the session.
6. Logout invalidates the session.

If cross-origin cookie restrictions prevent the current session architecture
from working reliably in the selected hosting setup, the team must stop and
resolve that deployment issue before adding advanced features.

Do not replace the authentication architecture unnecessarily.

---

# 11. Database Migration Process

The database schema and migrations must be applied to the production
MySQL database.

Required files currently include:

    database/schema.sql
    backend/src/main/java/com/cogniva/demo/database/migrations/V14__caregiver_aunthentication.sql
    backend/src/main/java/com/cogniva/demo/database/migrations/V15__emergency_events.sql

Before production deployment:

1. Create the production `dementia_app` database.
2. Apply the base schema.
3. Apply the authentication migration.
4. Apply the emergency events migration.
5. Verify all required tables exist.
6. Verify foreign keys.
7. Verify the demo/production caregiver setup.
8. Verify the application can connect successfully.

Production database credentials must not be stored inside SQL files committed
to Git.

---

# 12. Frontend Deployment Steps

## Step 1 – Prepare frontend

Verify:

- `frontend/index.html`
- `frontend/login.html`
- `frontend/css/style.css`
- `frontend/js/app.js`
- `frontend/js/api.js`
- other required frontend files

## Step 2 – Configure production API URL

Set the frontend API base URL to the final production Spring Boot URL.

Set `MEMORYSAATHI_API_BASE_URL` in `frontend/js/config.js` to that HTTPS URL
before publishing the static frontend.

Do this only after the team has selected and created the backend deployment.

## Step 3 – Create Cloudflare Pages project

Connect the project repository to Cloudflare Pages.

Use the frontend directory as the published static content.

No frontend build framework is required.

## Step 4 – Deploy

Deploy the frontend.

Record:

    Production frontend URL:
    _________________________________

## Step 5 – Test

Open the production frontend and verify that it can communicate with the
production backend.

---

# 13. Backend Deployment Steps

## Step 1 – Prepare backend

Verify:

- Maven build works.
- Spring Boot starts locally.
- Database connection works.
- Authentication works.
- Emergency workflow works.

## Step 2 – Create Render Web Service

Connect the repository to Render.

Use the backend project as the service source.

## Step 3 – Configure Java/Maven build

The deployment must build the existing Spring Boot Maven application.

The exact Render build/start commands will be recorded after the team
creates the service.

## Step 4 – Configure environment variables

Add the production values for:

    DB_HOST
    DB_PORT
    DB_NAME
    DB_USERNAME
    DB_PASSWORD
    EMERGENCY_CONTACT_NAME
    EMERGENCY_CONTACT_PHONE

Add future API secrets only when the corresponding feature is implemented.

## Step 5 – Deploy

Deploy the backend.

Record:

    Production backend URL:
    _________________________________

## Step 6 – Test

Verify:

    GET /api/auth/me

returns the expected authentication response when logged in and rejects
unauthenticated requests.

---

# 14. Database Deployment Steps

## Step 1

Create the production MySQL instance.

## Step 2

Create/use:

    dementia_app

## Step 3

Apply:

    database/schema.sql

## Step 4

Apply:

    backend/src/main/java/com/cogniva/demo/database/migrations/V14__caregiver_aunthentication.sql

## Step 5

Apply:

    backend/src/main/java/com/cogniva/demo/database/migrations/V15__emergency_events.sql

## Step 6

Verify:

    caregivers
    patients
    medications
    reminders
    emergency_events

exist.

## Step 7

Record the database connection information in the backend hosting
environment variables.

Never put the password in Git.

---

# 15. End-to-End Deployment Test

After all three components are deployed:

    Browser
       |
       v
    Cloudflare Pages
       |
       | HTTPS + session credentials
       v
    Render Spring Boot
       |
       | MySQL connection
       v
    Railway MySQL

Run the following checks.

### Authentication

1. Open production frontend.
2. Login with a valid caregiver account.
3. Verify dashboard opens.
4. Verify `/api/auth/me` works.
5. Logout.
6. Verify protected access fails.

### Patient

1. Create patient.
2. Retrieve patient.
3. Update patient.
4. Delete patient.

### Medication

1. Create medication.
2. Retrieve medication.
3. Update medication.
4. Delete medication.

### Reminder

1. Create reminder.
2. Retrieve reminder.
3. Update reminder.
4. Delete reminder.

### Emergency

1. Login.
2. Trigger emergency assistance.
3. Verify event is inserted into MySQL.
4. Verify caregiver dashboard displays the event.

### Frontend/backend communication

1. Open browser developer tools.
2. Verify API requests use the production backend URL.
3. Verify HTTPS is used.
4. Verify there are no unexpected CORS errors.
5. Verify authentication cookies/session work.
6. Verify failed backend requests produce a visible error state.

---

# 16. Secrets Checklist

Before deployment:

- [ ] Database username is stored as an environment variable.
- [ ] Database password is stored as an environment variable.
- [ ] Emergency contact information is configured through environment
      variables.
- [ ] No production secrets exist in Git.
- [ ] No production secrets exist in frontend JavaScript.
- [ ] No API keys exist in HTML.
- [ ] `.env` files are ignored by Git.
- [ ] Production HTTPS is enabled.

---

# 17. Production Information Sheet

The team must complete this section before making code changes for
deployment.

### Deployment targets

Frontend hosting:

    Cloudflare Pages

Backend hosting:

    Render

Database hosting:

    Railway MySQL

### URLs

Frontend:

    ______________________________________

Backend:

    ______________________________________

### Database

Host:

    ______________________________________

Port:

    ______________________________________

Database:

    dementia_app

### Required secrets

    DB_USERNAME       [configured: YES / NO]
    DB_PASSWORD       [configured: YES / NO]
    EMERGENCY_CONTACT_NAME
                      [configured: YES / NO]
    EMERGENCY_CONTACT_PHONE
                      [configured: YES / NO]

### CORS origin

Production frontend origin:

    ______________________________________

### Production API base URL

    ______________________________________

---

# 18. Deployment Gate

The team must NOT modify application code for deployment until this
deployment target has been reviewed and selected.

The following information must be known:

- [ ] Frontend hosting target selected.
- [ ] Backend hosting target selected.
- [ ] MySQL hosting target selected.
- [ ] Production frontend URL known or reserved.
- [ ] Production backend URL known or reserved.
- [ ] Production database host known.
- [ ] Database name confirmed.
- [ ] Database credentials/secrets identified.
- [ ] Emergency contact configuration identified.
- [ ] Production API URL identified.
- [ ] Production CORS origin identified.
- [ ] HTTPS requirement confirmed.

### Team Decision

Deployment approach:

    APPROVED / REJECTED

Selected by:

    ______________________________________

Date:

    ______________________________________

If rejected, record the alternative architecture here:

    ______________________________________

---

# 19. Deployment Principle

Keep deployment proportional to the project.

MemorySaathi is a college-level SIH prototype. The deployment should remain
a simple:

    Static Frontend
          +
    Single Spring Boot Backend
          +
    Single MySQL Database

Do not introduce Kubernetes, microservices, service meshes, or complex
DevOps infrastructure unless a future requirement specifically requires
them.
