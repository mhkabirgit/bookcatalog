const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

var author_model = require('../models/author');

var Author = author_model.Author;

module.exports.get_update_form = function(req, res, next) {
  Author.findById(req.params.id)
  .exec(function(err, author){
    if(err) {
      return next(err);
    }
    res.render('author_form', {title: 'Author Update', author: author});
  });
};


module.exports.post_validated = [

    body('first_name').isLength({min:1}).trim().withMessage('First name must be specified')
      .isAlphanumeric().withMessage('First name cannot contain non-alphanumeric charaster'),
    body('middle_name').trim()
        .isAlphanumeric().withMessage('Middle name cannot contain non-alphanumeric charaster'),
    body('last_name').isLength({min:1}).trim().withMessage('Last name must be specified')
        .isAlphanumeric().withMessage('Last name cannot contain non-alphanumeric charaster'),

    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('middle_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.render('author_form', {title: 'Update Author', author:req.body, errors:errors.array()})
        return;
      }
      else {
        var author = new Author({
          first_name: req.body.first_name,
          middle_name: req.body.middle_name,
          last_name: req.body.last_name,
          _id:req.params.id
        });
        Author.findByIdAndUpdate(req.params.id, author, {},
        function(err, author) {
          if(err) {
            return next(err);
          }
          res.redirect(author.url);
        });
      }
    }
];
