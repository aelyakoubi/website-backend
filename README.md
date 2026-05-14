# 🔧 Fullstack Event Management Platform

## 🌐 Live Demo

**Last Updated:** 14-05-2026

[Visit the Application](https://ivory-dugong-883765.hostingersite.com)

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

```txt id="91a74l"
/website-backend/src/data/users.json
```

Or create a new account through the signup page.

---

# 🛠️ Local Development Setup

## 1. Frontend

```bash id="egwwg0"
npm install
npm run dev
```

Runs on:

```txt id="1nrgrg"
http://localhost:5173
```

---

## 2. Backend

```bash id="y90sk9"
npm install
npm run dev
```

Runs on:

```txt id="x1uyz5"
http://localhost:3000
```

---

## 3. Prisma Studio

```bash id="xt7x7k"
npx prisma studio
```

Opens a browser interface for managing the database.

---

# 🌍 Environment-Based API Routing

The frontend communicates with the backend using environment variables:

```js id="dptxq7"
fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`);
```

This approach provides:

* consistent API routing
* easier deployment management
* separation between frontend and backend environments
* support for local and production environments

Example:

```env id="w0whrj"
VITE_API_URL=http://localhost:3000
```

Production:

```env id="n4j9bg"
VITE_API_URL=https://your-production-api-url.com
```

---

# 🏗️ Project Architecture

This project follows a split fullstack architecture:

```txt id="g84q0i"
website-frontend
website-backend
```

## Frontend Stack

* React
* Vite
* React Router
* Auth0 React SDK

## Backend Stack

* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Nodemailer

---

# 🔐 Authentication Architecture

Authentication uses a backend-first approach:

```txt id="kg0qmf"
Frontend
→ Auth0 Login
→ Backend OAuth Sync
→ Backend JWT
→ Protected API Routes
```

Auth0 is used as the identity provider, while authorization and protected routes are managed by the backend API.

---

# 🧪 Testing Notes

* `.env` files are excluded from the repository
* Test suites are currently being updated
* Postman collections are included for API testing

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
