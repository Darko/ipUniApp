var app = angular.module('MusicApp', [
    'ngMaterial',
    'ui.router',
    'satellizer'
]);

app
.config(function($authProvider) {
  $authProvider.facebook({
      clientId: 'SUPER SECRET',
      responseType: 'token'
  });

  $authProvider.google({
    clientId: 'SUPER SECRET'
  });
})

.component('navbar', {
  templateUrl: './components/navbar/navbar.html',
  controllerAs: '$ctrl',
  controller: function() {
      var $ctrl = this;
  }
})

