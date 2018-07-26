const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var genre_model = require('../models/genre');
var Genre = genre_model.Genre;

module.exports.get_update_form = function(req, res, next) {
  Genre.findById(req.params.id)
  .exec(function(err, genre){
    if(err) {
      return next(err);
    }
    else{
      if(genre==null) {
        var err = new Error('Genre not found');
        err.status=404;
        return next(err);
      }
      else{
        res.render('genre_form', {title: 'Genre Update', genre:genre});
      }

    }
  });
};

module.exports.post_validated = [

  body('name', 'Genre name required').isLength({min:1}).trim(),

  sanitizeBody('name').trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('genre_form', {title:'Update Genre', genre: genre, errors:errors.array()});
      return;
    }
    else {
      Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {}, function(err, genre){
        if(err){
          return next(err);
        }
        res.redirect(genre.url);
      });
      }
    }
]
