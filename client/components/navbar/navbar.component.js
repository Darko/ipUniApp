export default {
  templateUrl: './client/components/navbar/navbar.html',
  controllerAs: 'vm',
  controller: NavbarController
}

function NavbarController ($rootScope) {
  'ngInject';
  const vm = this;

  vm.isLoggedIn = $rootScope.isLoggedIn;

  $rootScope.$on('user:logout', function() {
    vm.isLoggedIn = $rootScope.isLoggedIn;
  });

  $rootScope.$on('user:login', function() {
    vm.isLoggedIn = $rootScope.isLoggedIn;
  });

}