import mongoose from 'mongoose';

const score2048Schema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Score2048 = mongoose.model('Score2048', score2048Schema);
export default Score2048;