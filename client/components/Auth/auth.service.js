import _ from 'lodash';

export default class AuthService {
  constructor($auth, $rootScope, $cookies, $http, $log) {
    const _this = this;

    this.userData = $auth.getPayload();
    
    this.isAuthenticated = function () {
      return $http.get('api/users.php?endpoint=isAuthenticated')
      .then(res => {
        if (res.data.user) {
          _this.setUser(res.data.user);
        }
        return res.data.user ? true : false;
      })
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
      $log.info('Logging out...');
      return $auth.logout()
      .then(function() {
        $rootScope.user = _this.userData = undefined;
        $cookies.remove('token');
        $rootScope.$emit('user:logout');
        $log.info('User logged out!');
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