app
// Public controllers

.controller('HomePageController', function($state, $timeout) {
  var vm = this;
})
.controller('MainController', function() {
  var vm = this;
})
.controller('PopularListsController', function() {
  var vm = this;
})
.controller('NewListsController', function() {
  var vm = this;
})

// Auth controllers

.controller('LoginController', function($auth, $state) {
  var vm = this;

  vm.authenticate = function(provider) {
    $auth.authenticate(provider);
  };
})

// User controllers

.controller('CreateListController', function() {
  var vm = this;
})