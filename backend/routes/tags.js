const express = require('express');
const router = express.Router();
const auth = require('../middleware/AuthMiddleware');
const { getTags, createTag } = require('../controllers/tagController');

router.get('/', auth, getTags);
router.post('/', auth, createTag);

module.exports = router;
