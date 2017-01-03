app
.factory('Auth', function($auth, $rootScope) {
  _this = this;

  this.userData = $auth.getPayload();
  
  this.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };

  this.isAdmin = function () {
    return _this.getCurrentUser()
    .then(function (user) {
      return user.role.indexOf('admin') > -1;
    });
  };

  this.authenticate = function (provider) {
    return $auth.authenticate(provider)
    .then(function() {
      _this.userData = $auth.getPayload();
      $rootScope.$emit('user:login');
    })
  };

  this.logout = function () {
    return $auth.logout()
    .then(function() {
      $rootScope.user = _this.userData = undefined;
      $rootScope.$emit('user:logout');
    })
  };

  this.getCurrentUser = function () {
    return _this.userData;
  };

  return _this;
});