import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ service: 'social' }));
app.listen(3007, () => console.log('Social on :3007'));
