const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // serve HTML/CSS/JS from 'public'

// --- MongoDB Atlas Connection ---
// Replace <USERNAME>, <PASSWORD>, <CLUSTER> with your Atlas credentials
const uri = "mongodb+srv://abcdequiz:quiz_123!24@cluster0.umqrfq6.mongodb.net/quizDB?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- Define Score Schema & Model ---
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

// This will create a 'results' collection automatically
const Score = mongoose.model("results", scoreSchema);

// --- Submit Score Route ---
app.post("/submit", async (req, res) => {
  const { name, score } = req.body;
  if (!name || score == null) return res.status(400).json({ message: "Invalid data" });

  try {
    // Save to MongoDB
    const newScore = new Score({ name, score });
    await newScore.save();

    // Log in console
    console.log(`Saved to MongoDB: User: ${name}, Score: ${score}`);

    // Send response to front-end
    res.json({ message: "Score submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving score" });
  }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
