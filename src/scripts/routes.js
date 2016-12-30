app.config(function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  
  $stateProvider
  .state('home', {
    url: '',
    templateUrl: './index.html',
    controller: 'HomePageController as vm'
  })
  .state('main', {
    url: '/',
    templateUrl: './views/main/main.html',
    controller: 'MainController as vm'
  })
  .state('main.popularLists', {
    url: 'popular',
    templateUrl: './views/main/main.html',
    controller: 'MainController as vm'
  })
  .state('main.newLists', {
    url: 'new',
    templateUrl: './views/main/main.html',
    controller: 'MainController as vm'
  })
  .state('main.createList', {
    url: 'create',
    templateUrl: './views/main/main.html',
    controller: 'MainController as vm'
  })
  .state('login', {
    url: 'login',
    templateUrl: './views/main/main.html',
    controller: 'MainController as vm'
  })
});