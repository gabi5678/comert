const express = require('express');
const router = express.Router();

const {
  getMakeupRecommendations,
  getRecommenderFilters
} = require('../controllers/recommenderController');

router.get('/filters', getRecommenderFilters);
router.post('/', getMakeupRecommendations);

module.exports = router;