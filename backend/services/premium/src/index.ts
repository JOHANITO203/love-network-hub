import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';

const app = express();
const PORT = parseInt(process.env.PORT || '3006');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.use(express.json());

app.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  res.json({ message: `Subscribed to ${plan}` });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'premium-service' });
});

app.listen(PORT, () => {
  console.log(`Premium service on port ${PORT}`);
});
