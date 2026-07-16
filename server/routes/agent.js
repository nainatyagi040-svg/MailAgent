const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { checkRateLimit } = require('../middleware/rateLimiter');

// Rate limiting: max 20 task requests per user per hour
router.post('/task', checkRateLimit('agent_task', 20), agentController.generateTask);

// Rate limiting: max 30 sends per user per hour
router.post('/send', checkRateLimit('agent_send', 30), agentController.sendDraft);

// Undo does not need strict rate limiting, or we can leave it un-limited
router.post('/undo', agentController.undoSend);

// Rate limiting for scheduling
router.post('/schedule', checkRateLimit('agent_schedule', 50), agentController.scheduleTask);

module.exports = router;
