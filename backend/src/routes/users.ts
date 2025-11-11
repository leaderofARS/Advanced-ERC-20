import { Router } from 'express';

const router = Router();

router.get('/:address', (req, res) => {
  res.json({ message: 'Users route - coming soon' });
});

export default router;
