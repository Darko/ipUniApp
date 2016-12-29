app.controller('HomePageController', function($state) {
  var vm = this;
  $state.go('home.main');
})
.controller('MainController', function() {
  var vm = this;
})