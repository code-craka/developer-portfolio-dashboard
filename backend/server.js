// backend/server.js

const express = require('express');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
require('dotenv').config();

const app = express();
// Hugging Face Spaces provide the port in an environment variable PORT
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
// This is where your API endpoints will go.
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the Visa Manager backend!' });
});

// --- SERVE FRONTEND ---
// This tells Express to serve all your HTML, CSS, etc., files
// from a 'public' directory at the root of the project.
app.use(express.static(path.join(__dirname, '..', 'public')));

// This is a catch-all route that sends the index.html file
// for any request that doesn't match an API route.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});