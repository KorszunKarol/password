
### env setup

Frontend: Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development

```
In the root directory, create `.env` similar to `.env.example`.


### Without Docker
1. Backend: `cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload`
2. Frontend: `cd frontend && npm install && npm run dev`

Access at http://localhost:3000

### With Docker
1. `docker compose up --build`

Access at http://localhost:3000