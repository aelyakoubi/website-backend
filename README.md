# 🔧 Development & Production-Based Approach

## 🌐 Live Demo

[Visit the App](https://website-frontend-8wnm.onrender.com)

> ⚠️ **Note:** It may take **50 to 160 seconds** for the **events to be loaded** due to the cold start delay on a free Render account.

## 🔐 Test Credentials

To test the application, log in using:

- **Username:** `Wimpie Blok`
- **Password:** `Wimpie1234`

> ⚠️ **Important:** Do **NOT** click the “Delete” button on the user account page. If you do, you’ll need a new test account.

- You can find alternative credentials in this GitHub file:
  `/website-backend/src/data/users.json`
- Or simply create a new account via the **signup page**.

---

## 🛠️ Local Setup Instructions

### Step 1: Frontend (Terminal 1)

```bash
npm install
npm audit fix       # Optional, if needed
npm run start       # Starts on port 5173
```

### Step 2: Backend (Terminal 2)

```bash
npm install
npm audit fix       # Optional, if needed
npm run start       # Starts on port 3000
```

### Step 3: MySQL Database (Terminal 3)

```bash
npx prisma studio
```

---

## 🌍 API Routing Note

To simplify development and deployment, **absolute URLs** are used when making API requests:

```js
fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`);
```

### 📌 Why this approach?

Using a full base URL via `import.meta.env.VITE_API_URL` avoids the need to switch between relative paths (like `/api/...`) in development vs. production. This ensures consistency and reduces manual adjustments across environments.

- ✅ Works seamlessly with environment variables (e.g., `.env.local`, `.env.production`)
- ✅ Prevents CORS issues when frontend and backend are hosted on different domains
- ✅ Suitable for both **local development** and **split deployment** (e.g., Render)

> ℹ️ `VITE_API_URL` is defined in your `.env` file and points to the backend’s base URL (e.g., `http://localhost:3000` for local or your Render backend URL in production).

---

## 🔗 Project Context: Render-Based Split Deployment

This project was originally developed as a **monorepo fullstack application** (frontend + backend in one).

> ⚠️ **However, due to Render’s free-tier limitations**, the project has been split into two public repositories for deployment:

- `website-frontend`
- `website-backend`

Although hosted separately, both are **part of the same project** and communicate via API endpoints. The frontend uses the backend through a base URL defined in environment variables.

> 🧩 In a professional setup (like Vercel, AWS, or Docker), the app can run as a single fullstack application again.

---

## 🧪 Testing Notes

- The `.env` file is included for testing purposes.
- Integration and unit tests are **still being updated** due to recent project changes.

---

## 🚀 Project Status: Onward & Upward

### 🔧 Current Phase (In Progress):

- Testing suite (Unit, API & Integration)
- Auth flow (Forgot Password, Secure Token Handling)
- Technical documentation (Setup Guide, API References)

![alt text](<Screenshot 2025-09-26 152829newstyledouble-1.png>)
![alt text](<Screenshot 2025-09-26 150937newstyle.png>)
![Screenshot 2024-10-11 142737](https://github.com/user-attachments/assets/92e87063-25ec-4a90-8eac-289aefc715af)
![Screenshot 2024-10-10 203209](https://github.com/user-attachments/assets/5d0d346a-8674-4cbe-8a52-1a2a17cfdbf7)
![Screenshot 2024-10-10 203329](https://github.com/user-attachments/assets/39f47830-ea77-4ced-ad81-dfe2d8b4158a)
![Screenshot 2024-10-11 142435](https://github.com/user-attachments/assets/e024e403-b32f-4fa2-90d8-4fd7ea7696cb)
![Screenshot 2024-10-11 142143](https://github.com/user-attachments/assets/ae3e63dd-7df3-4706-a2cd-8611deb42015)
![Screenshot 2024-10-11 142038](https://github.com/user-attachments/assets/2b65b00a-fd78-4953-a0a3-b155d4c359ea)
![Screenshot 2024-10-10 203233](https://github.com/user-attachments/assets/663e1e9d-b7c9-4f68-aaff-6d596a7c4f27)
![Screenshot 2024-10-10 203244](https://github.com/user-attachments/assets/aa76a163-7ef4-4f0b-9dcc-e2e19b793220)
![Screenshot 2024-10-10 203306](https://github.com/user-attachments/assets/019edd08-94b6-4a44-8e7f-4c513710a675)
![Screenshot 2024-10-11 143335](https://github.com/user-attachments/assets/15e07885-28bd-471f-bf4f-8ba3d4940b97)
![Screenshot 2024-10-11 143404](https://github.com/user-attachments/assets/002ac242-83cd-4163-b53e-1772c8a89639)
![Screenshot 2024-10-11 143421](https://github.com/user-attachments/assets/1af49b0c-3064-4791-a0d6-60c481022ae0)
