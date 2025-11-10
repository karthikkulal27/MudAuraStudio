import 'dotenv/config';

const base = process.env.TEST_BASE_URL || 'http://localhost:5000';

async function run() {
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@example.com', password: process.env.ADMIN_PASSWORD || 'Admin123!' })
  });
  const setCookie = loginRes.headers.get('set-cookie');
  const body = await loginRes.text();
  console.log('LOGIN status', loginRes.status, 'set-cookie?', !!setCookie, body);
  if (!setCookie) {
    console.log('No Set-Cookie received; cannot proceed');
    process.exit(1);
  }
  const cookieHeader = setCookie.split(',')[0].split(';')[0]; // token=...
  const prodRes = await fetch(`${base}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader },
    body: JSON.stringify({ name: 'Test A', price: 10.5, category: 'Test', images: [], stock: 0, featured: false, description: '' })
  });
  const prodText = await prodRes.text();
  console.log('CREATE status', prodRes.status, prodText);
}

run().catch(e => { console.error(e); process.exit(1); });
