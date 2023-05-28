const express = require('express');

const router =  express.Router();

const friendshipController = require('../controllers/friendship_controller');

router.get('/add-friends', friendshipController.addfriends);

router.get('/destroy', friendshipController.destroy);


module.exports = router;