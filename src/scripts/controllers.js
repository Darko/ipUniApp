app
// Public controllers
.controller('IndexController', function($sce) {
  var vm = this;
})
.controller('HomePageController', function($state, $timeout) {
  var vm = this;
  
  vm.featured = {
    'background-image': 'https://i1.imgiz.com/rshots/9489/rae-sremmurd-black-beatles-audio-ft-gucci-mane_9489108-31120_1920x1080.jpg',
    'background-size': 'cover'
  }
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