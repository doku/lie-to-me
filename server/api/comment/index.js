'use strict';

var express = require('express');
var controller = require('./comment.controller');

var router = express.Router();

//router.get('/', controller.list_item);
router.post('/', controller.post_item);
router.get('/:id', controller.list_item);
router.get('/id/:id', controller.get_item);
router.delete('/id/:id', controller.delete_item);
router.put('/id/:id', controller.vote);


/*
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
*/



module.exports = router;