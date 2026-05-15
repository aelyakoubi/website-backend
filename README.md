# 🔧 Fullstack Event Management Platform

## 🌐 Live Demo

**Last Updated:** 14-05-2026

[Visit the Application](https://ivory-dugong-883765.hostingersite.com)

---

# 🔒 Security Measures

This application implements multiple security layers to protect user data and authentication flows.

* **Helmet.js** — Secures HTTP headers against common web vulnerabilities.
* **bcrypt Hashing** — Passwords are securely hashed using industry-standard bcrypt encryption.
* **Salted Hashing** — Unique salts are added to passwords to prevent rainbow table attacks.
* **JWT Authentication** — Secure token-based authentication for protected API routes.
* **256-bit Encryption** — Strong encryption standard used for secure data protection.
* **OAuth 2.0 / Auth0** — Secure third-party authentication with trusted identity providers.
* **Environment Variables** — Sensitive credentials and API keys are separated from the source code.
* **CORS Protection** — Restricts unauthorized cross-origin requests.
* **Input Validation & Sanitization** — Prevents malicious input and injection attacks.
* **Protected Backend Routes** — API endpoints require authentication and authorization.
* **Secure Password Policies** — Enforces stronger account security.
* **HTTPS Encryption** — Data is encrypted during transmission between client and server.
* **Prisma ORM Security** — Helps prevent SQL injection vulnerabilities through ORM abstraction.
* **Error Handling Middleware** — Prevents sensitive backend error leakage to the frontend.
* **Rate Limiting** — Protects the API against brute-force attacks and request spam.

> ⚠️ **IMPORTANT:**  
> For demonstration, deployment, and hosting purposes, `.env` configuration files are included/configured so employers, recruiters, and clients can properly review and test the fullstack application functionality.
>
> 🔒 **IN A REAL PRODUCTION ENVIRONMENT, `.env` FILES, API KEYS, TOKENS, DATABASE CREDENTIALS, AND SENSITIVE CONFIGURATION VALUES WOULD NEVER BE PUBLICLY ACCESSIBLE OR EXPOSED.**
>
> PS: All sensitive production credentials would normally be managed through secure server-side environment management and protected hosting infrastructure.

---

# 🔐 Authentication

Users can:

* Sign up with email/password
* Log in with email/password
* Continue with:
  * Google
  * GitHub
  * Microsoft

Authentication is powered by Auth0 and integrated with a custom backend JWT authentication flow.

---

# 🧪 Test Credentials

You can test the application using:

* **Username:** `Wimpie Blok`
* **Password:** `Wimpie1234`

> ⚠️ Please do not delete the test account from the user account page.

Additional test users can be found in:

```txt
/website-backend/src/data/users.json
```

Or create a new account through the signup page.

---

# 🛠️ Local Development Setup

## 1. Frontend

```bash
npm install
npm run dev
```

Runs on:

```txt
http://localhost:5173
```

---

## 2. Backend

```bash
npm install
npm run dev
```

Runs on:

```txt
http://localhost:3000
```

---

## 3. Prisma Studio

```bash
npx prisma studio
```

Opens a browser interface for managing the database.

---

# 🌍 Environment-Based API Routing

The frontend communicates with the backend using environment variables:

```js
fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`);
```

This approach provides:

* consistent API routing
* easier deployment management
* separation between frontend and backend environments
* support for local and production environments

Example:

```env
VITE_API_URL=http://localhost:3000
```

Production:

```env
VITE_API_URL=https://your-production-api-url.com
```

---

# 🏗️ Project Architecture

This project follows a split fullstack architecture:

```txt
website-frontend
website-backend
```

## Frontend Stack

* React
* Vite
* React Router
* Chakra UI
* Auth0 React SDK

## Backend Stack

* Node.js
* Express.js
* Prisma ORM
* MySQL
* JWT Authentication
* Nodemailer

---

# 🔐 Authentication Architecture

Authentication uses a backend-first approach:

```txt
Frontend
→ Auth0 Login
→ Backend OAuth Sync
→ Backend JWT
→ Protected API Routes
```

Auth0 is used as the identity provider, while authorization and protected routes are managed by the backend API.

---

# 🧪 Testing Notes

* `.env` files are normally excluded from the repository for security reasons.
* For this specific demonstration project, `.env` files are included/configured as an exception so employers, recruiters, and clients can properly review, test, and run the fullstack application.
* In a real production environment, sensitive credentials, API keys, database URLs, and tokens would never be publicly accessible or exposed.
* Test suites are currently being updated.
* Postman collections are included for API testing.

---

# 🚀 Current Development Status

## Currently Improving

* Unit & integration testing
* Forgot password functionality
* API documentation
* Technical documentation
* Additional frontend optimizations

---

# 📸 Application Preview
