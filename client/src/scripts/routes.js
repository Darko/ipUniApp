export default function($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
  $locationProvider.html5Mode(true);
  $urlMatcherFactoryProvider.strictMode(false);

  $stateProvider
  .state('home', {
    url: '/',
    controller: 'HomePageController as vm',
    templateUrl: './client/views/main/home/home.html',
    resolve: {
      Your: function($http, Auth) {
        if (Auth.isAuthenticated()) {
          const id = Auth.getCurrentUser().id;
          return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
        } else {
          return {
            data: []
          }
        }
      },
      Popular: function($http, Auth) {
        return $http.get(`/api/playlists.php?endpoint=popular`);
      },
      New: function($http, Auth) {
        return $http.get(`/api/playlists.php?endpoint=new`);
      }
    }
  })
  
  // Public routes
  .state('main', {
    url: '',
    abstract: true,
    templateUrl: './client/views/main/main/main.html',
  })
  .state('main.popularLists', {
    url: '/popular',
    templateUrl: './client/views/main/popular-lists/popular-lists.html',
    controller: 'PopularListsController',
    controllerAs: 'vm',
    resolve: {
      Popular: function($http, Auth) {
        return $http.get(`/api/playlists.php?endpoint=popular`);
      }
    }
  })
  .state('main.newLists', {
    url: '/new',
    templateUrl: './client/views/main/new-lists/new-lists.html',
    controller: 'NewListsController as vm',
    resolve: {
      New: function($http, Auth) {
        return $http.get(`/api/playlists.php?endpoint=new`);
      }
    }
  })

  // Playlists
  .state('playlists', {
    abstract: true,
    templateUrl: './client/views/playlists/playlists.html',
  })

  .state('playlists.createList', {
    url: '/create',
    templateUrl: './client/views/playlists/create/create.html',
    controller: 'CreateListController as vm'
  })

  .state('playlists.yourLists', {
    url: '/yourlists',
    templateUrl: './client/views/playlists/your-lists/your-lists.html',
    controller: 'YourListsController as vm',
    resolve: {
      Lists: function($http, Auth) {
        const id = Auth.getCurrentUser().id;
        return $http.get(`/api/playlists.php?endpoint=index&userId=${id}`);
      }
    }
  })

  .state('playlists.playlist', {
    url: '/playlist/:playlistId',
    templateUrl: './client/views/playlists/playlist/playlist.html',
    controller: 'PlaylistController as vm',
    resolve: {
      List: function($http, $stateParams) {
        const id = $stateParams.playlistId;
        return $http.get(`/api/playlists.php?endpoint=show&playlistId=${id}`);
      }
    }
  })

  // Auth routes
  .state('login', {
    url: '/login',
    templateUrl: './client/views/auth/login/login.html',
    controller: 'LoginController as vm'
  })
  .state('logout', {
    url: '/logout',
    templateUrl: './client/views/auth/login/login.html',
    controller: function(Auth, $state) {
      Auth.logout()
      .then(function() {
        $state.go('home');
      })
    }
  })

  $urlRouterProvider.otherwise('/');
}