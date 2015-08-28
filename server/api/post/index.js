'use strict';

var express = require('express');
var controller = require('./post.controller');

var router = express.Router();

router.get('/', controller.list);
router.post('/', controller.post);
router.get('/:id', controller.get_item);
router.delete('/id/:id', controller.delete_post);
router.get('/id/:id', controller.get_item_by_id);
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