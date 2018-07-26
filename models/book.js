var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema (
  {isbn: {type: String, required: true, max:25 },
  title: {type: String, required: true, max:200},
  author: {type: Schema.ObjectId, ref: 'Author', required: true},
  genre: [{type: Schema.ObjectId, ref: 'Genre'}],
  synopsis: {type: String, required: true, max: 500}
  }
);

BookSchema
.virtual('url')
.get(function(){
  return '/catalog/book/detail/'+ this._id;
});

module.exports.Book = mongoose.model('Book', BookSchema);
