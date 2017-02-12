export default class LoginController {
  constructor($state, $http, $rootScope, Auth, $cookies, $window) {
    'ngInject';

    const vm = this;

    const returnState = $rootScope.returnState || 'home';
    $rootScope.returnState = null;

    vm.login = function(provider) {
      Auth.authenticate(provider)
      .then(() => {
        if (returnState) {
          $state.go(returnState);
        }
      })
      .catch(error => {
        console.log(error);
      })
    };

  }
}