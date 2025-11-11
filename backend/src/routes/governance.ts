import { Router } from 'express';

const router = Router();

router.get('/proposals', (req, res) => {
  res.json({ message: 'Governance route - coming soon' });
});

export default router;
