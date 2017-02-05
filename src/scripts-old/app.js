var app = angular.module('MusicApp', [
  'ngMaterial',
  'ui.router',
  'satellizer',
  'md.data.table',
  'ngMessages',
  'ngSanitize'
])
.run(function(Auth, $rootScope, $http) {
  $rootScope.isLoggedIn = Auth.isAuthenticated();

  $rootScope.$on('user:login', function(event, data) {
    $rootScope.isLoggedIn = true;
    checkForUserAndApply();
  });
  
  $rootScope.$on('user:logout', function() {
    $rootScope.isLoggedIn = false;
    localStorage.removeItem('user');
  });

  function checkForUserAndApply(userData = localStorage.getItem('user')) {
    var user = userData ? JSON.parse(userData) : undefined;

    if (user) {
      return Auth.setUser(user);
    } else {
      return Auth.logout();
    }
  }

  checkForUserAndApply();

})