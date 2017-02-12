import _ from 'lodash';

export default class AuthService {
  constructor($auth, $rootScope, $cookies, $http, $log) {
    const _this = this;

    this.userData = null;
    
    this.isAuthenticated = function () {
      return _this.userData ? true : false;
    };

    this.isAdmin = function () {
      return _this.getCurrentUser()
      .then(function (user) {
        return user.role.indexOf('admin') > -1;
      });
    };

    this.authenticate = function (provider) {
      $log.info('Authenticating...');
      return $auth.authenticate(provider)
      .then(() => {
        return $http.get(`/api/users.php?endpoint=authenticate&provider=${provider}`);
      })
      .then(response => {
        $cookies.put('token', response.data.token);
        delete response.data.token;

        $rootScope.$emit('user:login', response.data.user);

        $log.info('Authenticated!');
        return response.data.user;
      })
    };

    this.logout = function () {
      return $auth.logout()
      .then(function() {
        $rootScope.user = _this.userData = undefined;
        $cookies.remove('token');
        $rootScope.$emit('user:logout');
      })
    };

    this.setUser = function(data) {
      _this.userData = data;
    }

    this.getCurrentUser = function () {
      return _this.userData;
    };

    return _this;
  }
}