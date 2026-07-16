const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templatesController');

router.post('/', templatesController.createTemplate);
router.get('/', templatesController.listTemplates);
router.put('/:id', templatesController.updateTemplate);
router.delete('/:id', templatesController.deleteTemplate);

module.exports = router;
