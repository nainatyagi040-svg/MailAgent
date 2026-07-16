const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

router.post('/', contactsController.createContact);
router.get('/', contactsController.listContacts);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
