const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var genre_model = require('../models/genre');
var Genre = genre_model.Genre;

module.exports.get_create_form = function (req, res, next) {
  res.render('genre_form', {title: 'Create Genre'});
} ;

module.exports.post_validated = [

  body('name', 'Genre name required').isLength({min:1}).trim(),

  sanitizeBody('name').trim().escape(),

  (req, res, next) => {
    var genre = new Genre({name: req.body.name});
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.render('genre_form', {title:'Create Genre', genre: genre, errors:errors.array()});
      return;
    }
    else {
      Genre.findOne({name: genre.name})
      .exec(function(err, found_genre){
          if(err) {
            return next(err);
          }
          if(found_genre) {
            res.redirect(found_genre.url);
          }
          else {
            genre.save(function(err) {
              if(err) {
                return next(err);
              }
              else{
                res.redirect(genre.url);
              }
            });
          }
      });
    }
  }
]
