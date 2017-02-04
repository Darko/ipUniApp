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
.controller('HomePageController', function($state, $timeout, Your, New, Popular) {
  var vm = this;
  
  vm.featured = {
    'background-image': 'https://i1.imgiz.com/rshots/9489/rae-sremmurd-black-beatles-audio-ft-gucci-mane_9489108-31120_1920x1080.jpg',
  }

  vm.your = Your.data;
  vm.new = New.data;
  vm.popular = Popular.data;
  
  vm.featured = {
    id: 1,
    'background-image': 'https://i1.imgiz.com/rshots/9489/rae-sremmurd-black-beatles-audio-ft-gucci-mane_9489108-31120_1920x1080.jpg',
  }

})
.controller('MainController', function() {
  var vm = this;
})
.controller('PopularListsController', function(Popular) {
  var vm = this;

  vm.popular = Popular.data;
})
.controller('NewListsController', function(New) {
  var vm = this;

  vm.new = New.data;
})

// Playlist controllers
.controller('PlayListController', function(List, $mdDialog, Auth) {
  var vm = this;

  vm.user = Auth.getCurrentUser();
  vm.list = List.data || {};

  vm.currentSong = vm.list.items && vm.list.items[0] ? vm.list.items[0] : null;

  vm.addMoreSongs = function($event) {
    $mdDialog.show({
      parent: angular.element(document.body),
      targetEvent: $event,
      templateUrl: '../../components/dialogs/songs/addsongs.dialog.html',
      controllerAs: 'vm',
      bindToController: true,
      clickOutsideToClose: true,
      escapeToClose: true,
      locals: {
        List: vm.list
      },
      controller: function(List, $http) {
        var vm = this;

        vm.list = List;
        signSongs();

        vm.save = function() {
          var items = [];
          _.each(vm.list.items, function(item) {
            if (item.already) return;

            return items.push(item);
          });

          $http.put(`api/playlists.php?endpoint=addSongs`, {
            playlistId: vm.list.id,
            items
          })
          .then(function(response) {
            signSongs();
            $mdDialog.hide();
          })
        }

        function signSongs() {
          return _.each(vm.list.items, function(item) {
            item.already = true;
          });
        }
      }
    })
  };

  vm.isOwner = function() {
    return vm.user ? parseInt(vm.list.userId) === parseInt(vm.user.id) : false;
  }

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
      return $http.get(`/api/users.php?endpoint=authenticate&provider=facebook`)
    })
    .then(function(response) {
      var user = response.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (returnState) {
        $rootScope.$emit('user:login', response.data);
        $state.go(returnState);
      }
    })
    .catch(function(error) {
      console.log(error);
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
  
  vm.save = function($event) {
    $http.post('api/playlists.php?endpoint=create', vm.list)
    .then(function(response) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: '../../components/dialogs/success/success.dialog.html',
        controllerAs: 'vm',
        bindToController: true,
        clickOutsideToClose: true,
        escapeToClose: true,
        locals: {
          playlistId: response.data.id
        },
        controller: function(playlistId) {
          var vm = this;

          vm.message = 'Успешно креирана листа!';

          vm.close = function() {
            $mdDialog.hide(playlistId);
          }
        }
      })
      .then(function(id) {
        $state.go('playlists.playlist', { playlistId: id })
      }) 
    })   
  }

})