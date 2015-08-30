'use strict';



angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $stateParams, $state, $timeout) {
    $scope.awesomeThings = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.user = Auth.getCurrentUser();
    $scope.isAdmin = Auth.isAdmin();
    //console.log(Auth.isAdmin());
    
    $scope.videoId = $stateParams.id;
    $scope.page = "home";
    if($scope.videoId != null){
      $scope.page = "video";
      $http.get('/api/post/id/' + $scope.videoId).success( function(post){
        $scope.post = post;
        $scope.tubeVideo = post.youtube_id;
        //console.log(post[0]._id);
        //console.log(post[0].urlid);
        
          
      });
    }else{
    
      
      $http.get('/api/post').success(function(posts){
        $scope.posts = posts;
      });
    }

    $scope.deletePost = function(post_id) {
      //$http.get('/api/post')
      console.log(post_id);
      $http.get('/api/post/id/' + post_id).success(function(e){
        if(e.user == Auth.getCurrentUser()._id || Auth.isAdmin()){
          $http.delete('/api/post/id/' + e._id).success(function(e){
            $scope.$parent.deletedPost = true;
            $timeout(function(){
              $state.go('main');
            },2000);
            
            //console.log("post deleted");
          
          })
        }
      })
      
    };
    
    
    $scope.up_vote_post = function(post_id) { 
      /*
      Todo: make sure user is not on upvote list before you upvote to prevent double upvotes.
      */
      $http.get('/api/post/id/' + post_id).success(function(a){
        a.up_vote.push($scope.user._id);
        $http.put('/api/post/id/' + post_id, a).success(function(b){
          $scope.post.up_vote = b.up_vote;
          console.log("Post upvoted " + b.up_vote);   
        })
      })
    };
    
    $scope.down_vote_post = function(post_id){
      /*
      
      */
      $http.get('/api/post/id/' + post_id).success(function(a){
        a.down_vote.push($scope.user._id);
        $http.put('/api/post/id/'+ post_id, a).success(function(b){
          $scope.post.down_vote = b.down_vote;
          console.log("Post downvoted!" + b.down_vote);          
        })
      })
    };
    
    
    
    

    /*
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
    */

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
  
angular.module('workspaceApp').controller('PostCtrl', function($scope, $http, Auth, $state, $timeout, youtubeEmbedUtils){
  
  $scope.isLoggedIn = Auth.isLoggedIn; 
  
  $scope.submit = function(thing){
    var id = "";
    var user = Auth.getCurrentUser();
      
      //$http.get('/api/vid/' + id)
    if(Auth.isLoggedIn){
      
      var youtube_id = youtubeEmbedUtils.getIdFromURL($scope.urlid);
      var youtube_time = youtubeEmbedUtils.getTimeFromURL($scope.urlid);
      if(youtube_id != ""){
        $http.post('/api/post', {'title': $scope.title, 'user': user._id, 'urlid': $scope.urlid, 'username': user.name, 'youtube_id': youtube_id, 'youtube_time': youtube_time} ).success(function(a){  
          
          $scope.$parent.post_success = true;
          // disable the button
          $timeout(function(){
          //console.log(a._id);
          
            $state.go('video', {'id': a._id });
            
          }, 1500);
          
        });
      }else{
        $scope.$parent.youtube_id_fail = true;
        
      }
    }
    //return "";
  };
  

});

angular.module('workspaceApp')
  .controller('CommentCtrl', ['$scope', '$http', 'Auth', '$stateParams', function($scope, $http, Auth, $stateParams){
    $scope.isLoggedIn = Auth.isLoggedIn;
    var user = Auth.getCurrentUser();
    
    if($stateParams.id){
      $http.get('/api/comment/' + $stateParams.id).success(function(d){
        $scope.comments = d;
        
      });
    }
    
    $scope.submit_comment = function(){
      var user = Auth.getCurrentUser();
      //console.log('testsetset');
      if(Auth.isLoggedIn){
      //console.log('testessssss');
      //console.log($scope.comments);
      $http.post('/api/comment', {'user_id': user._id, 'user_name': user.name , 'comment': $scope.comment, 'post_id': $stateParams.id }).success(function(a){
          $scope.$parent.comment_success = true;
          $scope.comments.unshift(a);
          //console.log(a.up_vote);
          //console.log(a);
          
        })
      }
    }
    
    $scope.up_vote_comment = function(comment_index){
      /* 
      Search comments for comment to modify the comment with new up_vote status. 
      */
      var comment_id = $scope.comments[comment_index]._id;
      $http.get('/api/comment/id/' + comment_id).success(function(a){
        a.up_vote.push(user._id); // if user._id is in a.up_vote then do not push user._id
        
        $http.put('/api/comment/id/' + comment_id, a).success(function(b){
          $scope.comments[comment_index].up_vote = b.up_vote;
          console.log('comment up_voted!')
          
        })        
      });
    }
    
    $scope.down_vote_comment = function(comment_index){
      /*
        
      */
      var comment_id = $scope.comments[comment_index]._id;
      $http.get('/api/comment/id/' + comment_id).success(function(a){
        a.down_vote.push(user._id);
        $http.put('/api/comment/id/' + comment_id, a).success(function(b){
          $scope.comments[comment_index].down_vote = b.down_vote;
          console.log('Comment down_voted!');
        })        
      })
      
    }




    
    $scope.delete_comment = function(item){
      console.log(item);
      console.log($scope.comments[item]._id);
      $http.get('/api/comment/id/' + $scope.comments[item]._id).success(function(a){
        $http.delete('/api/comment/id/' + a._id).success(function(a){
          $scope.$parent.comment_deleted = true;
          $scope.comments.splice(item,1);
        })
        
        
      })
      
    }
    
    
  }]);


angular.module('workspaceApp')
  .controller('VideoCtrl', ['$scope', '$http', 'Auth', '$stateParams', function($scope, $http, Auth, $stateParams){
  $scope.isLoggedIn = Auth.isLoggedIn;
  //console.log($stateParams.id);
  
}]);
