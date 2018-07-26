var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
  role:{type:String, unique:true, required:true, max:25}
});

module.exports.Role=mongoose.model('Role', RoleSchema);
