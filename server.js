const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrilink';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/workers', require('./routes/workers'));
app.use('/api/jobs',    require('./routes/jobs'));

// HTML Pages
app.get('/',       (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/worker', (req, res) => res.sendFile(path.join(__dirname, 'views', 'worker.html')));
app.get('/farmer', (req, res) => res.sendFile(path.join(__dirname, 'views', 'farmer.html')));

app.listen(PORT, () => {
  console.log(`🌾 AgriLink running at http://localhost:${PORT}`);
});
