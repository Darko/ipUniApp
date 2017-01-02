app
// Public controllers
.controller('IndexController', function($sce) {
  var vm = this;

  vm.featured = {
    'background-image': 'https://i.ytimg.com/vi/b8m9zhNAgKs/maxresdefault.jpg',
    'background-size': 'cover'
  }
})

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

.controller('LoginController', function($rootScope, $state, Auth) {
  var vm = this;

  vm.login = function(provider) {
    Auth.authenticate(provider)
    .then(function() {
      $state.go('home');
    })
  };
})

// User controllers

.controller('CreateListController', function() {
  var vm = this;
})