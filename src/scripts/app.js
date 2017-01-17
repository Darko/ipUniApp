var app = angular.module('MusicApp', [
  'ngMaterial',
  'ui.router',
  'satellizer',
  'md.data.table'
])
.run(function(Auth, $rootScope) {
  $rootScope.isLoggedIn = Auth.isAuthenticated();

  $rootScope.$on('user:login', function() {
    $rootScope.isLoggedIn = true;
  });
  
  $rootScope.$on('user:logout', function() {
    $rootScope.isLoggedIn = false;
  });
})