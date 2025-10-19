import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ service: 'tracking' }));
app.listen(3009, () => console.log('Tracking on :3009'));
