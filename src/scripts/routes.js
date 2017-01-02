app.config(function($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');
  $urlMatcherFactoryProvider.strictMode(false);

  $stateProvider
  .state('home', {
    url: '/',
    controller: 'HomePageController as vm'
  })
  .state('main', {
    abstract: true,
    templateUrl: './views/main/main.html',
  })
  .state('main.popularLists', {
    url: '/popular',
    templateUrl: './views/main/popularLists.html',
    controller: 'PopularListsController as vm'
  })
  .state('main.newLists', {
    url: '/new',
    templateUrl: './views/main/newLists.html',
    controller: 'NewListsController as vm'
  })
  .state('main.createList', {
    url: '/create',
    templateUrl: './views/user/createList.html',
    controller: 'CreateListController as vm'
  })
  .state('login', {
    url: '/login',
    templateUrl: './views/auth/login.html',
    controller: 'LoginController as vm'
  })
  .state('logout', {
    url: '/logout',
    controller: function(Auth, $state) {
      Auth.logout()
      .then(function() {
        $state.go('home');
      })
    }
  })
});