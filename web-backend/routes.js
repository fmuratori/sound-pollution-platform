import express from 'express';

const router = express.Router();

router.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

router.get('/goodnight', (req, res) => {
  res.send('Goodnight, World!');
});

export default router;
