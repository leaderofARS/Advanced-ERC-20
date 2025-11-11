import { Router } from 'express';

const router = Router();

router.get('/balance/:address', (req, res) => {
  res.json({ message: 'Token route - coming soon' });
});

export default router;
