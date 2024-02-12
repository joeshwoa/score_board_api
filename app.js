const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://joeshwoageorge:J0eshwoa@jodb.0fzmbui.mongodb.net/scoreBoard', {})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Define a mongoose schema for the teams collection
const teamSchema = new mongoose.Schema({
  name: String,
  score: Number
});

// Create a mongoose model based on the schema
const Team = mongoose.model('Team', teamSchema);

// API to get teams and their scores sorted by score (biggest score first)
app.get('/teams', async (req, res) => {
  try {
    const sortedTeams = await Team.find().sort({ score: -1 });
    res.json(sortedTeams);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API to set team score by team name
app.post('/teams/:teamName/score', async (req, res) => {
  const { teamName } = req.params;
  const { score } = req.body;

  try {
    let team = await Team.findOne({ name: teamName });

    if (!team) {
      team = new Team({
        name: teamName,
        score: score
      });
    } else {
      team.score = score;
    }

    await team.save();

    res.json({ message: 'Score updated successfully', team });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API to increment team score by team name
app.put('/teams/:teamName/score/increment', async (req, res) => {
  const { teamName } = req.params;
  const { score } = req.body;

  try {
    let team = await Team.findOneAndUpdate(
      { name: teamName },
      { $inc: { score: score } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Score incremented successfully', team });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API to decrement team score by team name
app.put('/teams/:teamName/score/decrement', async (req, res) => {
  const { teamName } = req.params;
  const { score } = req.body;

  try {
    let team = await Team.findOneAndUpdate(
      { name: teamName },
      { $inc: { score: -score } },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Score decremented successfully', team });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
