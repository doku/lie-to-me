'use strict';

angular.module('workspaceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      }).state('post', {
        url: '/post',
        templateUrl: 'app/main/post.html',
        controller: 'PostCtrl'
      }).state('video', {
        url: '/video/:id',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });