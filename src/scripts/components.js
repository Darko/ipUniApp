app
.component('navbar', {
  templateUrl: './components/navbar/navbar.html',
  controllerAs: '$ctrl',
  controller: function(Auth, $rootScope) {
    var $ctrl = this;

    $ctrl.isLoggedIn = $rootScope.isLoggedIn;

    $rootScope.$on('user:logout', function() {
      $ctrl.isLoggedIn = $rootScope.isLoggedIn;
    });

    $rootScope.$on('user:login', function() {
      $ctrl.isLoggedIn = $rootScope.isLoggedIn;
    });

  }
})
