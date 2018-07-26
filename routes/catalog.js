var express = require('express');
var router = express.Router();

var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');

var adminChecker = (req, res, next) => {
  if(req.session.user.username === 'admin') {
    return next();
  }
  else {
    return;
  }
};


router.get('/', book_controller.book_list_home);

router.get('/statistics', book_controller.statistics);

router.get('/books', book_controller.book_list_get);

router.get('/book/detail/:id', book_controller.book_detail_get);

router.get('/book/create', adminChecker, book_controller.book_create_get);

router.post('/book/create', adminChecker, book_controller.book_create_post);

router.get('/book/detail/:id/delete', adminChecker, book_controller.book_delete_get);

router.post('/book/detail/:id/delete', adminChecker, book_controller.book_delete_post);

router.get('/book/detail/:id/update/',adminChecker, book_controller.book_update_get);

router.post('/book/detail/:id/update/', adminChecker, book_controller.book_update_post);


router.get('/authors', author_controller.author_list_get);

router.get('/author/detail/:id', author_controller.author_detail_get);

router.get('/author/create', adminChecker, author_controller.author_create_get);

router.post('/author/create', adminChecker, author_controller.author_create_post);

router.get('/author/detail/:id/delete', adminChecker, author_controller.author_delete_get);

router.post('/author/detail/:id/delete', adminChecker, author_controller.author_delete_post);

router.get('/author/detail/:id/update', adminChecker, author_controller.author_update_get);

router.post('/author/detail/:id/update', adminChecker, author_controller.author_update_post);

router.get('/genres', genre_controller.genre_list_get);

router.get('/genre/detail/:id', genre_controller.genre_detail_get);

router.get('/genre/create', adminChecker, genre_controller.genre_create_get);

router.post('/genre/create', adminChecker, genre_controller.genre_create_post);

router.get('/genre/detail/:id/delete/',adminChecker, genre_controller.genre_delete_get);

router.post('/genre/detail/:id/delete/', adminChecker, genre_controller.genre_delete_post);

router.get('/genre/detail/:id/update/', adminChecker, genre_controller.genre_update_get);

router.post('/genre/detail/:id/update/', adminChecker, genre_controller.genre_update_post);

module.exports = router;
