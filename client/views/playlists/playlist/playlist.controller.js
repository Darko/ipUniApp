export default class PlayListController {
  constructor(List, $mdDialog, Auth) {
    'ngInject';

    const vm = this;
    vm.list = List.data || {};
    vm.user = Auth.getCurrentUser();

    vm.currentSong = vm.list.items && vm.list.items[0] ? vm.list.items[0] : null;

    vm.addMoreSongs = function($event) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: '../../components/dialogs/songs/addsongs.dialog.html',
        controllerAs: 'vm',
        bindToController: true,
        clickOutsideToClose: true,
        escapeToClose: true,
        locals: {
          List: vm.list
        },
        controller: function(List, $http) {
          var vm = this;

          vm.list = List;
          signSongs();

          vm.save = function() {
            var items = [];
            _.each(vm.list.items, item => {
              if (item.already) return;

              return items.push(item);
            });

            $http.put(`api/playlists.php?endpoint=addSongs`, {
              playlistId: vm.list.id,
              items
            })
            .then(response => {
              signSongs();
              $mdDialog.hide();
            })
          }

          function signSongs() {
            return _.each(vm.list.items, item => {
              item.already = true;
            });
          }
        }
      })
    };

    vm.isOwner = function() {
      return vm.user ? parseInt(vm.list.userId) === parseInt(vm.user.id) : false;
    }
  }
}