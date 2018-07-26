const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

var book_model = require('../models/book');
var author_model = require('../models/author');
var genre_model = require('../models/genre');
var Book = book_model.Book;
var Author = author_model.Author;
var Genre = genre_model.Genre;

var book_create = require('./bookCreate');
var book_update = require('./bookUpdate');
var book_delete = require('./bookDelete');

module.exports.statistics = function(req, res) {
  async.parallel({
        book_count: function(callback) {
            Book.count({}, callback);
        },
        author_count: function(callback) {
            Author.count({}, callback);
        },
        genre_count: function(callback) {
            Genre.count({}, callback);
        },
    }, function(err, results) {
        res.render('statistics', { title: 'Statistics', error: err, data: results });
    });
};

module.exports.book_list_home = function(req, res, next) {
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('home', { title: 'Home', book_list: books });
    });
};


module.exports.book_list_get = function(req, res, next) {
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: books });
    });
};

module.exports.book_detail_get = function(req, res,next) {
  Book.findById(req.params.id)
               .populate('author')
               .populate('genre')
               .exec(function(err, book_found){
                 if(err) {
                   return next(err);
                 }
                 if(book_found==null) {
                   var err = new Error('Book not found');
                   err.status = 404;
                   return next(err);
                 }
                 else {
                   res.render('book_detail', {title:'Title', book:book_found});
                 }
        });
  };

module.exports.book_create_get = book_create.get_create_form;
module.exports.book_create_post = book_create.post_validated;

module.exports.book_delete_get = book_delete.delete_get;
module.exports.book_delete_post = book_delete.delete_post;

module.exports.book_update_get = book_update.get_update_form;
module.exports.book_update_post = book_update.post_validated;
