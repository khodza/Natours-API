const express = require('express');

const viewController = require('../controllers/viewControllers');

const router = express.Router();

router.get('/', viewController.getAllTours);
router.get('/tour', viewController.getTour);

module.exports = router;
