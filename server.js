const express = require('express');
const dotenv = require('dotenv');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.use('/api', profileRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the GitHub Profile Analyzer API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
