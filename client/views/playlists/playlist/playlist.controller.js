export default class PlayListController {
  constructor(List, $mdDialog, Auth, $http, $document, $state) {
    'ngInject';

    const vm = this;
    vm.list = List.data || {};
    vm.user = Auth.getCurrentUser();

    vm.currentSong = vm.list.items && vm.list.items[0] ? vm.list.items[0] : null;

    vm.isOwner = function() {
      return vm.user ? parseInt(vm.list.userId) === parseInt(vm.user.id) : false;
    }

    vm.actions = {
      addMoreSongs: function($event) {
        $mdDialog.show({
          parent: angular.element(document.body),
          targetEvent: $event,
          templateUrl: '../../client/components/dialogs/songs/addsongs.dialog.html',
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
      },
      deleteList: function($event) {
        const confirm = $mdDialog.confirm()
          .title('Избриши листа')
          .textContent(`Ова ќе ја избрише листата ${vm.list.title}.`)
          .targetEvent($event)
          .ok('Избриши!')
          .cancel('Откажи');
        
        $mdDialog.show(confirm)
        .then(() => {
          return $http({
            url: 'api/playlists.php?endpoint=delete',
            method: 'DELETE',
            data: {
              playlistId: parseInt(vm.list.id)
            }
          })
        })
        .then(response => {
          return $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element($document.body))
            .clickOutsideToClose(true)
            .title('Листата е избришана.')
            .ok('Во ред')
            .targetEvent($event)
          );
        })
        .then(() => {
          return $state.go('playlists.yourLists');
        })
      },
      playAll: function($event) {
        return;
      },
      addToMyLists: function($event) {
        return;
      }
    }
  }
}