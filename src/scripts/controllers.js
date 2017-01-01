app.controller('HomePageController', function($state, $timeout) {
  var vm = this;

})
.controller('MainController', function() {
  var vm = this;
})
.controller('LoginController', function($auth, $state) {
  var vm = this;

  console.log($state);

  vm.authenticate = function(provider) {
    $auth.authenticate(provider);
  };
});