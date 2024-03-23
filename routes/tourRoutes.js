const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
    .route('/top5cheap')
    .get(tourController.getTop5Cheap, tourController.getAllTours);

router.route('/get-good-tour-stats').get(tourController.getGoodTourStats);
router.route('/get-monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createATour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.udpateATour)
    .delete(tourController.deleteATourById);

module.exports = router;
