# TCS NQT 2025 Preparation Hub

Full-stack app: React frontend + Express/SQLite backend for TCS NQT study materials, UPI payment tracking, and coding practice.

## Project Structure

```
├── src/               # React frontend
├── server/            # Express backend
│   ├── index.js       # Server entry (serves API + built frontend)
│   ├── db.js          # SQLite database setup
│   ├── routes/        # API routes (auth, payments)
│   ├── middleware/     # JWT auth middleware
│   └── .env           # Environment config
├── public/            # Static assets
├── build/             # Frontend production build
├── Dockerfile         # Container deployment
└── render.yaml        # Render.com deployment
```

## Local Development

### 1. Start Backend
```bash
cd server
npm install
cp .env.example .env   # Edit credentials
node index.js          # Runs on http://localhost:5000
```

### 2. Start Frontend (separate terminal)
```bash
npm install
npm start              # Runs on http://localhost:3000
```

The frontend proxies API calls to the backend via CRA's proxy (port 5000).

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login → returns JWT |
| POST | `/api/payments` | No | Save payment record |
| GET | `/api/payments` | JWT | List all payments |
| DELETE | `/api/payments/:id` | JWT | Delete a payment |
| POST | `/api/compile` | No | Execute code (proxies to Piston API) |

## Deployment

### Option 1: Render (Recommended)

1. Push repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → New Web Service
3. Connect your repo
4. Render auto-detects `render.yaml` or use:
   - **Build Command:** `npm install && cd server && npm install && cd .. && npm run build`
   - **Start Command:** `node server/index.js`
5. Set environment variables in Render dashboard

### Option 2: Docker

```bash
docker build -t tcsnqt-app .
docker run -p 5000:5000 -e JWT_SECRET=your-secret tcsnqt-app
```

### Option 3: Manual (VPS)

```bash
npm run build                    # Build frontend
cd server && npm install --omit=dev
JWT_SECRET=xxx ADMIN_USER=admin ADMIN_PASS=xxx node index.js
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `JWT_SECRET` | `tcsnqt-secret-change-in-production` | JWT signing key |
| `ADMIN_USER` | `admin` | Admin login username |
| `ADMIN_PASS` | `admin123` | Admin login password |
| `DB_PATH` | `./data.db` | SQLite database file path |
