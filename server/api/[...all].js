import serverless from 'serverless-http';
import app from '../src/app.js';

export const config = {
  api: {
    bodyParser: false, // Let Express and specific routes (Stripe webhook) handle body parsing
  },
};

export default serverless(app);
