export default {
  templateUrl: './client/components/navbar/navbar.html',
  controllerAs: '$ctrl',
  controller: NavbarController
}

function NavbarController ($rootScope) {
  'ngInject';
  const $ctrl = this;

  $ctrl.isLoggedIn = $rootScope.isLoggedIn;

  $rootScope.$on('user:logout', function() {
    $ctrl.isLoggedIn = $rootScope.isLoggedIn;
  });

  $rootScope.$on('user:login', function() {
    $ctrl.isLoggedIn = $rootScope.isLoggedIn;
  });

}