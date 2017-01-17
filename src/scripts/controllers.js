app
// Public controllers
.controller('IndexController', function($sce) {
  var vm = this;
})
.controller('HomePageController', function($state, $timeout) {
  var vm = this;
  
  vm.featured = {
    'background-image': 'https://i1.imgiz.com/rshots/9489/rae-sremmurd-black-beatles-audio-ft-gucci-mane_9489108-31120_1920x1080.jpg',
    'background-size': 'cover'
  }

  vm.playlist = {
    preview: 'https://cdn-images-1.medium.com/max/1600/1*KGphCPfYHW0Sd5L4CXZTgA.jpeg',
    author: 'Darko',
    title: 'DankMeiMeis',
    likes: 420,
    songsCount: 69
  }
})
.controller('MainController', function() {
  var vm = this;
})
.controller('PopularListsController', function() {
  var vm = this;
})
.controller('NewListsController', function() {
  var vm = this;
})

// Playlist controllers

.controller('PlayListController', function() {
  var vm = this;

  vm.playlist = {
    author: 'Darko'
  }

  vm.songs = {
    _current: {
      name: "'The Journey' (2 Hour Drum & Bass Mix)",
      uploader: "SuicideSheeep",
      preview: 'https://cdn-images-1.medium.com/max/1600/1*KGphCPfYHW0Sd5L4CXZTgA.jpeg'
    },
    list: [
      {
        name: "'The Journey' (2 Hour Drum & Bass Mix)",
        uploader: "SuicideSheeep"
      }
    ]
  }

})

// Auth controllers

.controller('LoginController', function($rootScope, $state, Auth, $http, $auth) {
  var vm = this;

  vm.login = function(provider) {
    Auth.authenticate(provider)
    .then(function() {
      $state.go('home')
    })
  };
})

// User controllers

.controller('CreateListController', function() {
  var vm = this;
})