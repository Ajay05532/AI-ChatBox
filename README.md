# 🤖 AI-ChatBox

<img width="1440" height="900" alt="Screenshot 2026-03-02 at 10 02 06 PM" src="https://github.com/user-attachments/assets/80db0ac2-deb8-4632-848d-b0bcd9bde2fa" />


A simple AI Chat Application built using:

-   **Frontend:** Next.js
-   **Backend:** Node.js (Express)
-   **LLM Integration:** OpenAI API

------------------------------------------------------------------------

## 📁 Project Structure

    AI-ChatBox/
    ├── frontend/   → Next.js application
    ├── backend/    → Node.js (Express) API
    └── README.md

------------------------------------------------------------------------

## ⚙️ Prerequisites

Ensure the following are installed on your system:

-   **Node.js** (v18 or higher)
-   **npm**
-   **OpenAI API Key**

------------------------------------------------------------------------

## 🔐 Environment Setup (IMPORTANT)

Create a `.env` file inside the **backend** folder:

    backend/.env

Add the following configuration:

    OPENAI_API_KEY=your_openai_key_here

> ⚠️ Never expose your API key to the frontend.

------------------------------------------------------------------------

## 📦 Install Dependencies

### 1️⃣ Install Backend Packages

``` bash
cd backend
npm install
```

### 2️⃣ Install Frontend Packages

``` bash
cd ../frontend
npm install
```

------------------------------------------------------------------------

## ▶️ Running the Project

You need to run **backend and frontend simultaneously** using two
terminals.

------------------------------------------------------------------------

### 🚀 Start Backend Server

``` bash
cd backend
npm run dev
```

Backend will run on:

    http://localhost:5000

------------------------------------------------------------------------

### 🚀 Start Frontend Application

Open another terminal:

``` bash
cd frontend
npm run dev
```

Frontend will run on:

    http://localhost:3000

------------------------------------------------------------------------

## 🧪 Testing the API (Using Postman)

### POST Request

    http://localhost:3001/api/ask

### Request Body (JSON)

``` json
{
  "message": "Hello"
}
```

------------------------------------------------------------------------

## ❗ Important Notes

-   Keep the `.env` file **only inside `/backend`**.
-   Do **not** push `.env` to GitHub (add it to `.gitignore`).
-   Restart the backend server whenever you modify `.env`.
-   The frontend communicates with the backend API --- never call OpenAI
    directly from the client.

------------------------------------------------------------------------

## ✅ Workflow Summary

1.  Install dependencies
2.  Configure `.env` inside `/backend`
3.  Run backend server
4.  Run frontend app
5.  Start chatting 🎉
