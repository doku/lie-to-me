'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  post_date: Date, 
  update_date: Date,
  user: String,
  username: String,
  urlid: String,
  youtube_id: String,
  youtube_time: Number,
  up_vote: [String],
  down_vote: [String]
  
});

// on every save, add the date
PostSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.update_date = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.post_date)
    this.post_date = currentDate;

  next();
});

module.exports = mongoose.model('Post', PostSchema);