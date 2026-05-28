# GitHub Profile Analyzer API

A Node.js & Express REST API that fetches profile details from the GitHub API, processes insights (such as total repository stars and top languages), and saves them into a MySQL database.

## Live Demo
- **Live API URL:** [Insert your deployed Render/Railway URL here]

## Features Included
- Fetches GitHub user data and user repositories.
- Calculates total star counts and the user's top 3 most used languages.
- Implements an Upsert (Update or Insert) strategy to prevent duplicate entries.

## Local Setup Instructions
1. Clone the repo: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Set up your `.env` file with your local MySQL credentials.
4. Import the schema from `database.sql` (or paste the schema code into your MySQL client).
5. Start development server: `npm run dev`

## API Endpoints Documentation
- `POST /api/analyze/:username` - Analyzes a profile and saves insights.
- `GET /api/profiles` - Retrieves all analyzed profiles.
- `GET /api/profiles/:username` - Retrieves a specific profile from the DB.
