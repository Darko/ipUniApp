app
// Public controllers
.controller('IndexController', function($scope) {
  var vm = this;

  var elementWrapper = document.querySelector('#play-song-widget');

  vm.player = {
    isPlaying: false,
    isPaused: false
  }  
  
  $scope.$on('playlist:play', function(event, data) {

  });

  vm.startPlaying = function() {}
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

  vm.playlist = {
    preview: 'https://cdn-images-1.medium.com/max/1600/1*KGphCPfYHW0Sd5L4CXZTgA.jpeg',
    author: 'Darko',
    title: 'DankMeiMeis',
    likes: 420,
    songsCount: 69
  }
})
.controller('NewListsController', function() {
  var vm = this;

  vm.playlist = {
    preview: 'https://cdn-images-1.medium.com/max/1600/1*KGphCPfYHW0Sd5L4CXZTgA.jpeg',
    author: 'Darko',
    title: 'DankMeiMeis',
    likes: 420,
    songsCount: 69
  }
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
.controller('YourListsController', function() {
  var vm = this;

  vm.playlist = {
    preview: 'https://cdn-images-1.medium.com/max/1600/1*KGphCPfYHW0Sd5L4CXZTgA.jpeg',
    author: 'Darko',
    title: 'DankMeiMeis',
    likes: 420,
    songsCount: 69
  }

  vm.playlists = [];

})

// Auth controllers

.controller('LoginController', function($rootScope, $state, Auth, $http, $auth) {
  var vm = this;

  vm.login = function(provider) {
    Auth.authenticate(provider)
    .then(function(data_) {
      return $http.get(`/api/users.php?endpoint=authenticate&provider=facebook&access_token=${data_.access_token}&expires_in=${data_.expires_in}`)
    })
    .then(function(response) {
      Auth.userData = response.data;
      $rootScope.$emit('user:login');
    })
  };
})

// User controllers

.controller('CreateListController', function($http) {
  var vm = this;

  vm.songs = [];

  vm.lookupSongs = function(text) {
    var uri = `/api/songs.php?endpoint=search&q=${text}`;
    return $http.get(uri)
    .then(function(result) {
      return result.data || [];
    })
    .catch(function(error) {
      // handle properly
    })
  }

  vm.addToSongs = function(snippet) {
    vm.songs.push(snippet);
    vm.searchText = '';
  }

})