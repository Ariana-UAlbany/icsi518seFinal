# MoodLog – Digital Journal & Mood Tracker

MoodLog is a full-stack web application that allows users to create personal journal entries, track their moods over time, and reflect on emotional patterns. The application uses Google authentication for secure access and is fully deployed to the cloud. AI Usage Notice: Made using ChatGPT.
---

## Documentation
Please see included powerpoint presentation outlining the process of building this application

---
## Live Application

- **Frontend (Vercel):** https://icsi518se-final.vercel.app  
- **Backend API (Google Cloud Run):** https://moodlog-api-883602115118.us-central1.run.app  
- **Health Check:** `/health`

---

## Features

- Google OAuth login
- JWT-based authentication
- Create, view, edit, and delete journal entries
- Mood selection for each entry
- Calendar view to browse entries by date
- Sentiment analysis using an external API
- Animated UI with dark theme
- User-specific data isolation

---

## Tech Stack

**Frontend**
- React (Vite)
- Google OAuth
- CSS animations
- Deployed on Vercel

**Backend**
- Node.js & Express
- MongoDB Atlas
- JWT authentication
- Google OAuth verification
- Hugging Face Sentiment Analysis API
- Deployed on Google Cloud Run

---

## How It Works

1. Users sign in using Google OAuth on the frontend.
2. The frontend sends the Google ID token to the backend.
3. The backend verifies the token and issues a JWT.
4. The JWT is stored in localStorage and used to access protected API routes.
5. Journal entries are stored in MongoDB and scoped to the authenticated user.
6. Sentiment analysis is performed when entries are created.
7. The frontend displays entries with animations and calendar filtering.

---

## Security

- All journal routes require a valid JWT
- Users can only access their own data
- Environment variables are used for all secrets
- `.env` files are not committed to GitHub

---

## Running Locally

1. Clone the repository
2. Create `.env` files in both `client` and `server`
3. Install dependencies:
   ```bash
   npm install
4. Start the backend and frontend servers
