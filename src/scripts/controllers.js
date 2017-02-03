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
.controller('PlayListController', function(List) {
  var vm = this;

  vm.list = List.data || {};

  vm.currentSong = vm.list.items && vm.list.items[0] ? vm.list.items[0] : null;

})
.controller('YourListsController', function(Lists) {
  var vm = this;

  vm.lists = Lists.data;
})

// Auth controllers

.controller('LoginController', function($rootScope, $state, Auth, $http, $auth) {
  var vm = this;

  var returnState = $rootScope.returnState || 'home';
  $rootScope.returnState = null;

  vm.login = function(provider) {
    Auth.authenticate(provider)
    .then(function(data_) {
      return $http.get(`/api/users.php?endpoint=authenticate&provider=facebook&access_token=${data_.access_token}&expires_in=${data_.expires_in}`)
    })
    .then(function(response) {
      var user = response.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (returnState) {
        $rootScope.$emit('user:login', response.data);
        $state.go(returnState);
      }
    })
  };
})

// User controllers

.controller('CreateListController', function($http, Auth, $rootScope, $mdDialog, $state) {
  var vm = this;

  vm.loggedIn = Auth.isAuthenticated();

  if (!vm.loggedIn) {
    $rootScope.returnState = 'playlists.createList';
    $state.go('login');
  }

  vm.user = Auth.getCurrentUser();

  vm.list = {
    private: false,
    userId: parseInt(vm.user.id),
    items: []
  }

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

  vm.addToSongs = function(song) {
    var newSong = undefined;
    if (!parseInt(song.id)) {
      newSong = {
        videoId: song.id.videoId,
        title: song.snippet.title,
        channelTitle: song.snippet.channelTitle,
        thumbnail: song.snippet.thumbnails.high.url
      }
    } else {
      newSong = song;
    }
    vm.list.items.push(newSong);
    vm.searchText = '';
  }

  vm.removeSong = function(song) {
    _.remove(vm.list.items, song);
  }

  vm.save = function($event) {
    console.log(vm.list);
    $http.post('api/playlists.php?endpoint=create', vm.list)
    .then(function(response) {

      console.log(response);

      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: '../../components/dialogs/success/success.dialog.html',
        controllerAs: 'vm',
        bindToController: true,
        clickOutsideToClose: true,
        escapeToClose: true,
        controller: function($scope) {
          var vm = this;
          vm.message = 'Успешно креирана листа!';

          vm.close = function() {
            return $mdDialog.hide();
          }
        }
      })
    })
    .then(function() {

    })    
  }

})