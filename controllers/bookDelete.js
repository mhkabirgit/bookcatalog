var async = require('async');

var book_model = require('../models/book');
var Book = book_model.Book;

module.exports.delete_get = function (req, res, next) {
  Book.findById(req.params.id).populate('author').populate('genre')
  .exec(function(err, book) {
    if(err) {
      return next(err);
    }
    res.render('book_delete', {title: 'Delete Book', book:book});
  });
};

module.exports.delete_post = function (req, res, next) {
  Book.findByIdAndRemove(req.params.id)
  .exec(function(err, book) {
    if(err) {
      return next(err);
    }
    res.redirect('/catalog/books');

  });
};
