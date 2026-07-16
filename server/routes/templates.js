const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templatesController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/', templatesController.createTemplate);
router.get('/', templatesController.listTemplates);
router.put('/:id', templatesController.updateTemplate);
router.delete('/:id', templatesController.deleteTemplate);

module.exports = router;
