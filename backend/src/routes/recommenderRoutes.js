const express = require('express');
const router = express.Router();

const { getMakeupRecommendations } = require('../controllers/recommenderController');

router.post('/', getMakeupRecommendations);

module.exports = router;