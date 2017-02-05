export default class LoginController {
  constructor(Auth, $timeout, $rootScope) {
    'ngInject';

    const vm = this;

    const returnState = $rootScope.returnState || 'home';
    $rootScope.returnState = null;

    vm.login = function(provider) {
      Auth.authenticate(provider)
      .then(data => {
        return $http.get(`/api/users.php?endpoint=authenticate&provider=facebook`)
      })
      .then(response => {
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));

        if (returnState) {
          $rootScope.$emit('user:login', response.data);
          $state.go(returnState);
        }
      })
      .catch(error => {
        console.log(error);
      })
    };

  }
}