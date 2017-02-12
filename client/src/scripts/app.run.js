export default function(Auth, $rootScope, $http, $cookies, $log) {

  $rootScope.$on('user:login', function(event, data) {
    Auth.setUser(data);
    $rootScope.isLoggedIn = true;
  });
  
  $rootScope.$on('user:logout', function() {
    $rootScope.isLoggedIn = false;
    localStorage.removeItem('user');
  });

  if ($cookies.get('token')) {
    $http.get('api/users.php?endpoint=isAuthenticated')
    .then(response => {
      if (response.data.user) {
        $log.info('Authenticated!');
        Auth.setUser(response.data.user);
        $rootScope.isLoggedIn = true;
      }
    })
  } else {
    Auth.logout();
  }
}