








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
var Comment = require('./comment.model');


exports.post_item = function(req, res){
  //var dat = req.body;
  //dat.up_vote.push(req)
  Comment.create(req.body, function(err, item) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(item);
  });
    
    
};

exports.list_item = function(req, res){
    Comment.find({post_id: req.params.id}, function (err, item){
        if(err) { return handleError(res, err); }
        return res.status(200).json(item);
        
    })
    
};

exports.delete_item = function(req, res){
    //console.log(req);
    Comment.findById(req.params.id, function (err, item) {
        if(err) { return handleError(res, err); }
        if(!item) { return res.status(404).send('Not Found'); }
        item.remove(function(err) {
          if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
      });
    
};

exports.get_item = function(req, res){
    Comment.findById( req.params.id , function(err, item){
        if(err) { return handleError(res, err); }
        if(!item) {return res.status(404).send('Not Found'); }
        return res.json(item);
    })
      
};

// Updates an existing thing in the DB.
exports.vote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Comment.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { 
      //console.log("thing is not found " + thing);
      return res.status(404).send('Not Found'); 
    }
    
    thing.up_vote = _.union(thing.up_vote, req.body.up_vote);
    thing.down_vote = _.union(thing.down_vote, req.body.down_vote);
    //console.log(req.body );
    //thing = _.merge(thing, req.body);
    //console.log(updated);
    thing.save(function (err) {
      if (err) { return handleError(res, err); }
      //console.log(thing);
      return res.status(200).json(thing);
    });
  });
};





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







