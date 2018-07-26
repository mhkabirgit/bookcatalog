var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/signup', user_controller.create_user_get);
router.post('/signup', user_controller.create_user_post);

router.get('/signin', user_controller.signin_get);
router.post('/signin', user_controller.signin_post);

router.get('/signout', user_controller.signout_get);

module.exports = router;
