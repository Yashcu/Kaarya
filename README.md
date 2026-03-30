# Kaarya

A task management app built with a React frontend and an Express + Prisma backend. It lets users create boards, manage lists and cards, drag items across the board, and organize work with labels, members, due dates, and checklists.

![Kaarya Preview](./Board-Preview.png)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand, Axios
- Backend: Node.js, Express, Prisma, Zod
- Database: PostgreSQL
- Drag and Drop: Atlaskit Pragmatic Drag and Drop

## How It Works

- The frontend loads a board-based workspace and renders lists and cards in columns.
- Users can create, update, delete, and reorder lists and cards.
- Cards support labels, assigned members, due dates, and checklist items.
- The backend exposes REST APIs for boards, lists, cards, members, and checklist actions.
- Prisma manages database access, schema migrations, and seed data.

## System Design

```mermaid
flowchart LR
    U["User Browser"]
    F["Frontend
React + Vite + Zustand"]
    A["REST API
Express.js"]
    S["Service Layer
Boards / Lists / Cards"]
    C["Cache
NodeCache"]
    P["Prisma ORM"]
    D["PostgreSQL"]

    U --> F
    F -->|HTTP /api requests| A
    A --> S
    S --> C
    S --> P
    P --> D
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Yashcu/Kaarya.git
cd kaarya
```

### 2. Set up environment variables

Create these files from the examples:

- `backend/.env`
- `frontend/.env`

Backend example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/kaarya
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
DEBUG=true
```

Frontend example:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Prepare the database

From the `backend` folder:

```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

### 5. Start the backend

From the `backend` folder:

```bash
npm run dev
```

### 6. Start the frontend

From the `frontend` folder:

```bash
npm run dev
```

### 7. Open the app

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Project Structure

```text
backend/   Express API, Prisma schema, migrations, seed data
frontend/  React app, board UI, drag and drop, state management
```

## Notes

- The project uses seeded sample data so you can explore the app immediately.
- Make sure PostgreSQL is running before applying migrations.
- For production, set `CORS_ORIGIN` to your deployed frontend URL and `VITE_API_URL` to your deployed backend URL.
