'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  post_date: Date, 
  update_date: Date,
  user_id: String,
  user_name: String,
  comment: String,
  post_id: String,
  comment_id: String,
  up_vote: [String],
  down_vote: [String],
  vote_id: String
});

// on every save, add the date
CommentSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Comment', CommentSchema);