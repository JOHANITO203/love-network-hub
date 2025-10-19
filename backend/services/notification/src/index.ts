import express from 'express';
const app = express();
app.get('/health', (req, res) => res.json({ service: 'notification' }));
app.listen(3010, () => console.log('Notification on :3010'));
