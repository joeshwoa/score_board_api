const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Dummy data for teams and scores
let teams = [
  { name: 'Pawn', score: 0 },
  { name: 'Bishop', score: 0 },
  { name: 'Knight', score: 0 },
  { name: 'Rook', score: 0 },
  { name: 'Queen', score: 0 },
  { name: 'King', score: 0 }
];

// API to get teams and their scores sorted by score (biggest score first)
app.get('/teams', (req, res) => {
  const sortedTeams = teams.slice().sort((a, b) => b.score - a.score); // Sorting teams by score in descending order
  res.json(sortedTeams);
});

// API to set team score by team name
app.post('/teams/:teamName/score', (req, res) => {
  const { teamName } = req.params;
  const { score } = req.body;

  // Find the team by name
  const team = teams.find(t => t.name === teamName);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  // Update the team's score
  team.score = score;
  res.json({ message: 'Score updated successfully', team });
});

// API to increment team score by team name
app.put('/teams/:teamName/score/increment', (req, res) => {
  const { teamName } = req.params;

  // Find the team by name
  const team = teams.find(t => t.name === teamName);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  // Increment the team's score
  team.score += 1;
  res.json({ message: 'Score incremented successfully', team });
});

// API to decrement team score by team name
app.put('/teams/:teamName/score/decrement', (req, res) => {
  const { teamName } = req.params;

  // Find the team by name
  const team = teams.find(t => t.name === teamName);
  if (!team) {
    return res.status(404).json({ message: 'Team not found' });
  }

  // Decrement the team's score
  team.score -= 1;
  res.json({ message: 'Score decremented successfully', team });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
