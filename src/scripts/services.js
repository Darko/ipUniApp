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
  };

  this.logout = function () {
    return $auth.logout()
    .then(function() {
      $rootScope.user = _this.userData = undefined;
      $rootScope.$emit('user:logout');
    })
  };

  this.setUser = function(data) {
    this.userData = data;
    $rootScope.user = data;
  }

  this.getCurrentUser = function () {
    return _this.userData;
  };

  return _this;
});