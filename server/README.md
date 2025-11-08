# ClayAura Backend API

Express + MySQL + Prisma backend for the ClayAura e-commerce platform.

## 🧠 How this backend works (high-level)

- Express receives requests, applies CORS, parses JSON/cookies, and routes to feature modules.
- Route files forward to controllers that contain business logic.
- Controllers use Prisma to read/write MySQL based on the Prisma schema.
- Auth uses JWT stored in httpOnly cookies. A middleware verifies the cookie and sets `req.user`.
- Stripe Checkout creates payment sessions; webhooks notify the backend about completed payments.

Flow: Request → Router → Controller → Prisma → MySQL → Response (JSON)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL server running (XAMPP, WAMP, or standalone)
- npm or yarn package manager

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update these in `.env`:
- `DATABASE_URL`: Your MySQL connection string (e.g., `mysql://root:password@localhost:3306/clayaura`)
- `JWT_SECRET`: A strong random secret for JWT tokens
- `STRIPE_SECRET_KEY`: Your Stripe secret key (get from Stripe Dashboard)
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (after setting up webhooks)

### 3. Create Database
Create a MySQL database named `clayaura`:

```sql
CREATE DATABASE clayaura;
```

### 4. Run Migrations
```bash
npm run prisma:migrate
```

This will create all necessary tables in your database.

### 5. Seed Sample Data
```bash
npm run prisma:seed
```

This will populate your database with sample products.

### 6. Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 🧭 Folder structure

```
server/
├── prisma/
│   ├── schema.prisma         # Database models (MySQL)
│   └── seed.js               # Seed sample products
├── src/
│   ├── config/
│   │   └── database.js       # Prisma client instance
│   ├── controllers/
│   │   ├── authController.js # Register/Login/Logout/Me
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js           # JWT cookie verification
│   ├── routes/
│   │   ├── auth.js           # /api/auth/*
│   │   ├── products.js       # /api/products/*
│   │   ├── orders.js         # /api/orders/*
│   │   └── stripe.js         # /api/stripe/*
│   └── index.js              # Express app entry
├── .env.example              # Environment template
├── package.json              # Scripts & deps
└── README.md
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products (supports query params: category, featured, search, limit, offset)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)

### Stripe
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout session (requires auth)
- `POST /api/stripe/webhook` - Handle Stripe webhooks

> Note: Stripe webhooks require the raw request body for signature verification. Ensure the webhook route uses `express.raw({ type: 'application/json' })` before `express.json()` is applied to that specific route.

## 🔧 Development Commands

```bash
npm run dev              # Start dev server with hot reload
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:seed      # Seed database with sample data
```

## 🔐 Authentication

The API uses JWT tokens stored in httpOnly cookies for authentication.

**Cookie name:** `token`  
**Expiry:** 7 days  
**Security:** httpOnly, sameSite=lax, secure in production

### Auth flow
1) Register: validate → hash with bcrypt → create user → issue JWT → set httpOnly cookie → return user
2) Login: validate → compare bcrypt hash → issue JWT → set cookie → return user
3) Me: middleware verifies cookie/JWT → controller returns user profile
4) Logout: clear cookie

## 💳 Stripe Integration

### Setup Webhooks (for production):
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe/webhook
   ```
3. Copy the webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 📊 Database Schema

### User
- id, email (unique), name, password (hashed), createdAt, updatedAt

### Product
- id, name, description, price, category, images (JSON), stock, featured, createdAt, updatedAt

### Order
- id, userId, total, status, shippingAddress (JSON), paymentIntent, createdAt, updatedAt

### OrderItem
- id, orderId, productId, quantity, price

## 🛠️ Tech Stack

- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** MySQL
- **Auth:** JWT + bcrypt
- **Payments:** Stripe
- **Runtime:** Node.js 18+

## 🔒 Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens stored in httpOnly cookies (XSS protection)
- CORS configured for frontend origin only
- Environment variables for sensitive data
- Stripe webhook signature verification

## 📝 Frontend Integration

Update your frontend auth utilities (`src/utils/auth.js`) to call these endpoints:

```javascript
const API_URL = 'http://localhost:5000/api';

export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return (await res.json()).user;
};
```

### Using credentials on fetch
Always pass `credentials: 'include'` so the browser sends/receives the auth cookie.

## 🐛 Troubleshooting

**Database connection failed:**
- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify database exists

**Prisma Client not generated:**
```bash
npm run prisma:generate
```

**MySQL client error (Windows XAMPP cli):**
If you see `caching_sha2_password could not be loaded`, use phpMyAdmin to create the DB, or install the official MySQL 8 client and connect using that instead of XAMPP’s MariaDB client.

**Port already in use:**
Change PORT in `.env` or kill the process using port 5000

## 📦 Deployment

For production:
1. Set `NODE_ENV=production` in .env
2. Use a managed MySQL service (Aiven, Railway, PlanetScale Hobby, AWS RDS)
3. Set strong JWT_SECRET
4. Configure Stripe webhook endpoint in Stripe Dashboard
5. Deploy to Railway, Render, or similar platform

---

Built with ❤️ for ClayAura

## 🗄️ Using Aiven for MySQL (Alternative to PlanetScale)

You can run this backend against an Aiven-managed MySQL instance. Aiven requires TLS but Prisma supports it seamlessly.

### 1. Create the Service
1. Sign up at https://console.aiven.io/
2. Create a new service: Select MySQL, pick the smallest (trial / dev) plan, choose a region.
3. Wait until the service status is "Running".

### 2. Get Connection Parameters
Open the service page → Connection Information. You’ll see:
- Host
- Port (usually random high port, e.g. 16123)
- Database name (often `defaultdb` unless you create a new one)
- Username (e.g. `avnadmin`)
- Password (click "Show password")
- SSL: CA certificate available for download

### 3. Construct Prisma `DATABASE_URL`
Basic format (works if Aiven CA is trusted by your environment):
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```
Example:
```
mysql://avnadmin:yourPassword@mysql-yourproj.aivencloud.com:16123/defaultdb
```

If you encounter SSL validation errors locally, download the CA cert (e.g. `ca.pem`) into `server/prisma/` and append:
```
?sslcert=ca.pem&sslaccept=strict
```
or to ignore missing SAN entries:
```
?sslcert=ca.pem&sslaccept=accept_invalid_certs
```
Full example:
```
DATABASE_URL="mysql://avnadmin:p%40ssw0rd@mysql-yourproj.aivencloud.com:16123/defaultdb?sslcert=ca.pem&sslaccept=accept_invalid_certs"
```
Note: Percent-encode special characters in the password (e.g. `@` becomes `%40`).

### 4. Apply Migrations
Run these from the `server` directory after updating `.env`:
```bash
npx prisma migrate deploy
npx prisma db seed  # If you want sample data
```

### 5. Production Environment Variables on Vercel
Add the same `DATABASE_URL` plus:
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (after webhook setup)
- `FRONTEND_URL` (your deployed frontend origin)

### 6. Webhook Reminder
Stripe webhooks still work the same. No changes required for Aiven.

### 7. Connection Pool Consideration (Serverless)
Because Vercel functions can scale concurrency, consider limiting connections:
```
DATABASE_URL="mysql://avnadmin:password@host:port/defaultdb?connection_limit=1"
```
Increase later if needed.

### 8. Troubleshooting
| Issue | Fix |
|-------|-----|
| `getaddrinfo ENOTFOUND` | Verify host matches Aiven service host exactly. |
| `Handshake inactivity timeout` | Ensure port matches the one in Aiven (not 3306). |
| SSL errors | Add `?sslaccept=accept_invalid_certs` or supply CA via `sslcert=ca.pem`. |
| Password special chars | Percent-encode them. |

### 9. Creating Additional Databases/Users
Use Aiven console or the service's "Query Editor" to run:
```sql
CREATE DATABASE clayaura;
GRANT ALL PRIVILEGES ON clayaura.* TO 'avnadmin';
```
Then point `DATABASE_URL` at `clayaura` instead of `defaultdb`.

### 10. Pricing Note
Aiven typically offers trial credit rather than a permanent unlimited free tier. For a fully free forever dev database, alternatives include Railway (metered), Neon (Postgres), or Supabase (Postgres). Still, Aiven is fine for evaluation or short-term staging.

