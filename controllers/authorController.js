
const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var async = require('async');

var author_model = require('../models/author');
var book_model = require('../models/book');
var Author = author_model.Author;
var Book = book_model.Book;

var author_create = require('./authorCreate');
var author_delete = require('./authorDelete');
var author_update = require('./authorUpdate');

module.exports.author_list_get = function(req, res, next) {
  Author.find({})
  .sort([['last_name', 'ascending']])
  .exec(function(err, authors){
    if(err){
      return next(err);
    }
    else{
      res.render('author_list', {title:'Author List', author_list:authors})
    }
  });
};

module.exports.author_detail_get = function(req, res, next) {
  async.parallel ({
    author:function(callback) {
      Author.findById(req.params.id)
      .exec(callback)
    },
    author_books: function(callback) {
      Book.find({author: req.params.id},'title synopsis')
      .exec(callback)
    },
  },
    function(err, results) {
      if(err) {
        return next(err);
      }
      if(results.author==null){
        var err = new Error("Author Not Found");
        error.status=404;
        return next(err);
      }
      else {
        res.render('author_detail', {title: 'Author Detail', author:results.author, author_books:results.author_books});
      }
    });
};

module.exports.author_create_get = author_create.get_create_form;
module.exports.author_create_post = author_create.post_validated;

module.exports.author_delete_get = author_delete.delete_get;
module.exports.author_delete_post = author_delete.delete_post;

module.exports.author_update_get = author_update.get_update_form;
module.exports.author_update_post = author_update.post_validated;
