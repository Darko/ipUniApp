app.config(function($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
  $locationProvider.html5Mode(true);
  $urlMatcherFactoryProvider.strictMode(false);

  $stateProvider
  .state('home', {
    url: '/',
    controller: 'HomePageController as vm',
    templateUrl: './views/main/index.html',
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
    controllerAs: 'vm'
  })
  .state('main.newLists', {
    url: '/new',
    templateUrl: './views/main/newLists.html',
    controller: 'NewListsController as vm'
  })

  // User routes
  .state('main.createList', {
    url: '/create',
    templateUrl: './views/user/createList.html',
    controller: 'CreateListController as vm'
  })

  .state('playlist', {
    url: '/playlist/:userId/:playlistId',
    templateUrl: './views/playlists/playlist.html',
    controller: 'PlayListController as vm'
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