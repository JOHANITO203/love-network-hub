import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT || '3003');

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'matching-service' });
});

app.listen(PORT, () => {
  console.log(`Matching service on port ${PORT}`);
});
