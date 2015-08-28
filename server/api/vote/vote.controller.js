'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VoteSchema = new Schema({
  post_date: Date, 
  update_date: Date,
  user_id: String,
  user_name: String,
  post_id: String,
  comment_id: String,
  vote: Number
});

// on every save, add the date
VoteSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.update_date = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.post_date)
    this.post_date = currentDate;
  
  if(!this.comment_id)
    this.comment_id = "";
    
    if(!this.post_id)
        this.post_id = "";


  next();
});

module.exports = mongoose.model('Vote', VoteSchema);