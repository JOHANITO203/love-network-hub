import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ service: 'translation' }));
app.listen(3011, () => console.log('Translation on :3011'));
