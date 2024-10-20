import express from "express";
const router = express.Router();

// Exemple de données de leaderboard
let leaderboard = [
  { player: "Joueur 1", score: 100 },
  { player: "Joueur 2", score: 80 },
];

// Route pour obtenir le leaderboard
router.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// Route pour ajouter un score au leaderboard
router.post("/leaderboard", (req, res) => {
  const { player, score } = req.body;
  leaderboard.push({ player, score });
  leaderboard.sort((a, b) => b.score - a.score); // Trier par score décroissant
  res.status(201).json({ message: "Score ajouté avec succès" });
});

export default router;