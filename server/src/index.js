const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const quizRoutes = require('./routes/quizRoutes');
const downloadRoutes = require('./routes/downloadRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging middleware

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const questionRoutes = require('./routes/questionRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const stateRoutes = require('./routes/stateRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/state', stateRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/download', downloadRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
const errorHandler = require('./middlewares/errorHandler'); // Corrected path to 'middlewares'
app.use(errorHandler);

// 404 handler - This should be *after* routes and *before* the global error handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found - Invalid API Endpoint' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});