








/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Post = require('./post.model');


exports.post = function(req, res){
    Post.create(req.body, function(err, post) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(post);
  });
    
    
};

exports.list = function(req, res){
  
  //MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
  
  /*
  Event.find()
    .select('name')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
        name: 'asc'
    })
    .exec(function(err, events) {
        Event.count().exec(function(err, count) {
            res.render('events', {
                events: events,
                page: page,
                pages: count / perPage
            })
        })
    })
    */
    
    Post.find(function (err, post){
        if(err) { return handleError(res, err); }
        return res.status(200).json(post);
        
    })
    
};

exports.delete_post = function(req, res){
    console.log(req);
    Post.findById(req.params.id, function (err, thing) {
        if(err) { return handleError(res, err); }
        if(!thing) { return res.status(404).send('Not Found'); }
        thing.remove(function(err) {
          if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
      });
    
};

exports.get_page = function(req, res){
  var per_page = 50;
  var page = (req.params.id-1)*per_page;
  
  Post.find().limit(per_page).skip(page).sort({post_date: '-1'})
      .exec(function(err, post){
        //console.log(post);
        if(err) { return handleError(res, err); }
        return res.status(200).json(post);
        
      })
  
  //MyModel.find(query, fields, { skip: 10, limit: 5 }, function(err, results) { ... });
  
  /*
  Event.find()
    .select('name')
    .limit(perPage)
    .skip(perPage * page)
    .sort({
        name: 'asc'
    })
    .exec(function(err, events) {
        Event.count().exec(function(err, count) {
            res.render('events', {
                events: events,
                page: page,
                pages: count / perPage
            })
        })
    })
    */
  
  
  
  
};

exports.get_item = function(req, res){
    Post.find({urlid: req.params.id}, function(err, thing){
        if(err) { return handleError(res, err); }
        if(!thing) {return res.status(404).send('Not Found'); }
        return res.json(thing);
    })
      
};

exports.get_item_by_id = function(req, res){
    Post.findById(req.params.id, function(err, thing){
        if(err) { return handleError(res, err); }
        if(!thing) { return res.status(404).send('Not Found'); }
        return res.json(thing);
        
        
    })
    
};

exports.vote = function(req, res){
  if(req.body._id) { delete req.body._id; }
  Post.findById(req.params.id, function(err, thing){
    if(err) { return handleError(res, err); } 
    if(!thing) { return res.status(404).send('Not Found'); }
    
    //console.log(req.body.up_vote);
    
    //var updated = _.merge(thing, req.body);
    thing.up_vote = _.union(thing.up_vote, req.body.up_vote);
    thing.down_vote = _.union(thing.down_vote, req.body.down_vote);
    thing.save(function(err){
      if (err) { return handleError(res, err); } 
      return res.status(200).json(thing);
    });
    /*
    console.log(updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(updated);
    });
    */
  });
}


/*


// Get list of things
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

*/

function handleError(res, err) {
  return res.status(500).send(err);
}







