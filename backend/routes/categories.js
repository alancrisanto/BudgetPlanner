const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

router.get('/', getCategories); // no auth needed

module.exports = router;
