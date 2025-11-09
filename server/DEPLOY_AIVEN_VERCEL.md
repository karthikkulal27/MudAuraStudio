# Deploy Backend (Express + Prisma) on Vercel with Aiven MySQL

This guide walks you through deploying BOTH:
1. Backend (server folder) to Vercel Functions
2. Frontend (root Vite app) to Vercel Static Hosting
3. Using Aiven for MySQL as the production database

---
## ✅ High-Level Overview

Flow: Browser → Vercel (Frontend) → API calls to Vercel Serverless Functions → Prisma connects to Aiven MySQL.
Stripe Checkout redirects to Stripe; webhook calls back into Vercel function.

---
## 0. Prerequisites
- Aiven account (trial or plan) with a MySQL service created
- Vercel account
- Stripe account with test API keys
- Repo pushed to GitHub (or GitLab/Bitbucket) for Vercel import

---
## 1. Prepare Aiven MySQL
1. In Aiven console: Create MySQL service (smallest plan) → Wait until running.
2. Open the service → Connection Information:
   - Host
   - Port (NOT always 3306; copy exactly)
   - Username (e.g. `avnadmin`)
   - Password (click Reveal)
   - Default DB: `defaultdb` (you can create `clayaura` later if you wish)
3. (Optional) Create dedicated DB:
   ```sql
   CREATE DATABASE clayaura;
   GRANT ALL PRIVILEGES ON clayaura.* TO 'avnadmin';
   ```
4. (Optional) Download CA certificate if you plan to use `sslcert`.

---
## 2. Build the DATABASE_URL
Base format:
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```
Example:
```
mysql://avnadmin:p%40ssW0rd@mysql-yourproj.aivencloud.com:16123/clayaura?connection_limit=1
```
Notes:
- Percent-encode special characters in password (`@` -> `%40`).
- Start with `connection_limit=1` for serverless.
- If you get SSL errors locally, append:
  `?sslcert=ca.pem&sslaccept=accept_invalid_certs`
  and place `ca.pem` in `server/prisma/`.

---
## 3. Update Local `.env`
In `server/.env` (create if missing):
```
DATABASE_URL="mysql://avnadmin:ENCODED_PASSWORD@HOST:PORT/clayaura?connection_limit=1"
JWT_SECRET="replace-with-long-random-string"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # after webhook
FRONTEND_URL="http://localhost:5173"
NODE_ENV=development
```

---
## 4. Test Locally
From `server/`:
```bash
npm install
npx prisma migrate deploy
npm run prisma:seed   # optional
npm run dev
```
Check: http://localhost:5000/api/health
If errors: verify port, host, password, and that encoding is correct.

---
## 5. Stripe Webhook (Local Dev - Optional Now)
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
Copy the signing secret → set `STRIPE_WEBHOOK_SECRET` in `.env`.

---
## 6. Prepare for Vercel Deployment
Backend structure already serverless-ready:
- `server/src/app.js` exports Express app.
- `server/api/[...all].js` is the Vercel function entry using `serverless-http`.
No further code changes needed.

---
## 7. Deploy Backend to Vercel
1. In Vercel dashboard → New Project → Import your repo.
2. When it asks for root directory:
   - Create ONE project for backend: set root to `server/`.
3. Framework preset: "Other" (since it's a custom Express serverless).
4. Build Command: `npm run build`
5. Output Directory: leave empty (functions project).
6. Environment Variables (paste all):
   - `DATABASE_URL=...`
   - `JWT_SECRET=...`
   - `STRIPE_SECRET_KEY=...`
   - `STRIPE_WEBHOOK_SECRET=...` (after creating webhook route in Stripe dashboard)
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
7. Deploy.
8. After deploy, test endpoint:
   `https://<backend-project>.vercel.app/health` (or `/api/health` if using the serverless direct route)

---
## 8. Deploy Frontend to Vercel
1. New Project again → root directory `/` (project root with `index.html`).
2. Framework: Vite (or auto-detected).
3. Build Command: `npm run build` (ensure root `package.json` has build script, usually `vite build`).
4. Output Directory: `dist`
5. Environment Vars:
   - `VITE_API_URL=https://<backend-project>.vercel.app`  
     (If you decide to standardize on `/api` prefix, then set `.../api` instead.)
6. Deploy.
7. Open site and test login/register flows.

---
## 9. Configure Stripe Webhook for Production
In Stripe Dashboard → Developers → Webhooks → Add endpoint:
- Endpoint URL: `https://<backend-project>.vercel.app/stripe/webhook`  
   (If you standardize on the `/api` prefix: `.../api/stripe/webhook`)
- Events: `checkout.session.completed`
- Reveal signing secret → update Vercel backend project env `STRIPE_WEBHOOK_SECRET` → redeploy.

---
## 10. Verify Critical Flows
| Flow | How to test |
|------|-------------|
| Auth cookie | Open devtools → Application → Cookies after login |
| Products API | Network tab shows fetch to `/products` (or `/api/products` if prefix used) returning JSON |
| Cart persistence | Add item logged-in, refresh → still there |
| Checkout | Click checkout → redirect to Stripe test page |
| Webhook (after payment) | Stripe Dashboard → Logs shows 200 from webhook |

---
## 11. Common Errors & Fixes
| Error | Cause | Fix |
|-------|-------|-----|
| 500 on all queries | Wrong `DATABASE_URL` | Double-check host/port/password encoding |
| `ECONNREFUSED` | Port invalid or service sleeping | Confirm Aiven port, ensure service running |
| SSL handshake | CA not trusted | Add `?sslaccept=accept_invalid_certs` or provide `sslcert=ca.pem` |
| CORS blocked | FRONTEND_URL mismatch | Set exact deployed frontend origin in backend env (e.g., https://your-frontend.vercel.app) |
| Cookies missing | Missing `credentials: 'include'` | Ensure fetch calls include credentials |
| Stripe webhook 400 | Raw body lost | Ensure `/api/stripe/webhook` mounted before `express.json()` (already done) |

---
## 12. Updating After Changes
- Code change in backend → push → Vercel auto-deploy.
- Schema change:
  ```bash
  npx prisma migrate dev --name add_field   # locally
  git add prisma/migrations
  git commit -m "Add field"
  git push
  # Vercel build runs `prisma generate` (migrations are already applied via deploy step locally). For production use dedicated: npx prisma migrate deploy via CI step if needed.
  ```

---
## 13. Optional Hardening
- Use `strict` instead of `accept_invalid_certs` once cert trust verified.
- Add rate limiting (e.g. express-rate-limit) for auth routes.
- Switch prices to DECIMAL in Prisma for currency accuracy.

---
## 14. Rollback Strategy
If deploy breaks:
1. Revert commit locally → push → redeploy.
2. For schema mistakes: create new migration fixing fields; avoid manual DB edits.
3. Keep a local `.env.backup` with old stable `DATABASE_URL`.

---
## 15. Checklist Summary
- [ ] Aiven MySQL running
- [ ] DATABASE_URL built & tested locally
- [ ] Prisma migrations deployed
- [ ] Backend deployed on Vercel (health OK)
- [ ] Frontend deployed (API URL points to backend)
- [ ] Auth works (cookies set)
- [ ] Products load from DB
- [ ] Checkout session redirects
- [ ] (Optional) Webhook configured

You're live 🎉

If you get stuck, capture the exact error message and environment variable values (mask secrets) and debug step-by-step.
