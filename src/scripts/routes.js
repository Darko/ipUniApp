app.config(function($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
  $locationProvider.html5Mode(true);
  $urlMatcherFactoryProvider.strictMode(false);

  $stateProvider
  .state('home', {
    url: '/',
    controller: 'HomePageController as vm',
    templateUrl: './views/main/index.html',
    resolve: {
      Your: function($http, Auth) {
        var id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      },
      Popular: function($http, Auth) {
        var id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      },
      New: function($http, Auth) {
        var id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      }
    }
  })
  
  // Public routes
  .state('main', {
    url: '',
    abstract: true,
    templateUrl: './views/main/main.html',
  })
  .state('main.popularLists', {
    url: '/popular',
    templateUrl: './views/main/popularLists.html',
    controller: 'PopularListsController',
    controllerAs: 'vm',
    resolve: {
      Popular: function($http, Auth) {
        var id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      }
    }
  })
  .state('main.newLists', {
    url: '/new',
    templateUrl: './views/main/newLists.html',
    controller: 'NewListsController as vm',
    resolve: {
      New: function($http, Auth) {
        var id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      }
    }
  })

  // Playlists
  .state('playlists', {
    abstract: true,
    templateUrl: './views/playlists/playlists.html',
  })

  .state('playlists.createList', {
    url: '/create',
    templateUrl: './views/playlists/create.html',
    controller: 'CreateListController as vm'
  })

  .state('playlists.yourLists', {
    url: '/yourlists',
    templateUrl: './views/playlists/yourLists.html',
    controller: 'YourListsController as vm',
    resolve: {
      Lists: function($http, Auth) {
        var id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      }
    }
  })

  .state('playlists.playlist', {
    url: '/playlist/:playlistId',
    templateUrl: './views/playlists/playlist.html',
    controller: 'PlayListController as vm',
    resolve: {
      List: function($http, $stateParams) {
        var id = $stateParams.playlistId;
        return $http.get(`/api/playlists.php?endpoint=show&id=${id}`);
      }
    }
  })

  // Auth routes
  .state('login', {
    url: '/login',
    templateUrl: './views/auth/login.html',
    controller: 'LoginController as vm'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: './views/auth/login.html',
    controller: function(Auth, $state) {
      Auth.logout()
      .then(function() {
        $state.go('home');
      })
    }
  })

  $urlRouterProvider.otherwise('/');
});