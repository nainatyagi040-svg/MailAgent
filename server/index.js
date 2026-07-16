require('dotenv').config();
const express = require('express');
const cors = require('cors');

const agentRoutes = require('./routes/agent');
const contactsRoutes = require('./routes/contacts');
const templatesRoutes = require('./routes/templates');
const activityRoutes = require('./routes/activity');
const analyticsRoutes = require('./routes/analytics');
const { startScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agent', agentRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`MailPilot Backend running on port ${PORT}`);
  // Start the background scheduler
  startScheduler();
});
