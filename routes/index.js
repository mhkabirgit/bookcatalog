var express = require('express');
var router = express.Router();
var book_controller = require('../controllers/bookController');

/* GET home page. */
router.get('/', book_controller.book_list_home);
module.exports = router;
