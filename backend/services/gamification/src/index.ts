import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ service: 'gamification' }));
app.listen(3008, () => console.log('Gamification on :3008'));
