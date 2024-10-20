import express from 'express';
import Score2048 from '../models/Score2048.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

// Route pour récupérer les scores
router.get('/', protectRoute, async (req, res) => {
  try {
    const scores = await Score2048.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour ajouter un score
router.post('/', protectRoute, async (req, res) => {
  const { score } = req.body;
  const newScore = new Score2048({
    playerName: req.user.name,
    score,
    userId: req.user._id
  });

  try {
    const savedScore = await newScore.save();
    res.status(201).json(savedScore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;