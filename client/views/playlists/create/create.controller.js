export default class CreateController {
  constructor($http, Auth, $rootScope, $mdDialog, $state) {
    'ngInject';
    
    const vm = this;

    vm.loggedIn = Auth.isAuthenticated();
    vm.user = Auth.getCurrentUser();

    if (!vm.loggedIn) {
      $rootScope.returnState = 'playlists.createList';
      $state.go('login');
    } else {
      vm.list = {
        private: false,
        userId: vm.user.id,
        items: []
      }
      console.log('meimeis');
    }
    
    vm.save = function($event) {
      $http.post('api/playlists.php?endpoint=create', vm.list)
      .then(function(response) {
        $mdDialog.show({
          parent: angular.element(document.body),
          targetEvent: $event,
          templateUrl: '../../components/dialogs/success/success.dialog.html',
          controllerAs: 'vm',
          bindToController: true,
          clickOutsideToClose: true,
          escapeToClose: true,
          locals: {
            playlistId: response.data.id
          },
          controller: function(playlistId) {
            var vm = this;

            vm.message = 'Успешно креирана листа!';

            vm.close = function() {
              $mdDialog.hide(playlistId);
            }
          }
        })
        .then(function(id) {
          $state.go('playlists.playlist', { playlistId: id })
        }) 
      })   
    }
  }
}