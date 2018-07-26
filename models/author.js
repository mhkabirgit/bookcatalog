var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthorSchema = new Schema (
  {
    first_name: {type: String, required: true, max:100},
    middle_name: {type: String, max:100},
    last_name: {type: String, required: true, max:100}
  }
);

AuthorSchema
.virtual('name')
.get(function() {
  var middle = this.middle_name;
  if(middle != undefined) {
    return this.last_name + ', '+ this.first_name + ' ' + middle;
  }
  else {
    return this.last_name + ', ' + this.first_name;
  }
});

AuthorSchema
.virtual('url')
.get(function(){
  return '/catalog/author/detail/' + this._id;
});

module.exports.Author = mongoose.model('Author', AuthorSchema);
