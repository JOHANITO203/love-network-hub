import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = parseInt(process.env.PORT || '3005');
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const response = await claude.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }]
  });
  res.json({ narrative: response.content });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'narrative-service' });
});

app.listen(PORT, () => {
  console.log(`Narrative service on port ${PORT}`);
});
