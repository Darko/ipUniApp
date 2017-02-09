export default class PlayListController {
  constructor(List, $mdDialog, Auth, $http, $document, $state, $mdToast, PlayerService) {
    'ngInject';

    const vm = this;
    vm.list = List.data || {};
    vm.user = Auth.getCurrentUser();
    vm.loggedIn = Auth.isAuthenticated();
    vm.isFollwing = false;

    if (vm.loggedIn) {
      $http.get(`/api/playlists.php?endpoint=isfollowing&userId=${vm.user.id}&playlistId=${vm.list.playlistId}`)
      .then(response => {
        vm.isFollowing = response.data.following;
      });
    }

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
        .then(() => {
          PlayerService.setPlaylist(vm.list);
        })
      },
      deleteList: function($event) {
        const confirm = $mdDialog.confirm()
          .title('Избриши листа')
          .textContent(`Ова ќе ја избрише листата ${vm.list.title}.`)
          .targetEvent($event)
          .ok('Избриши')
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
        PlayerService.play({
          playlist: vm.list,
          song: vm.list.items && vm.list.items.length ? vm.list.items[0] : null
        });
      },
      follow: function($event) {
        const action = vm.isFollowing ? 'unfollow' : 'follow';
        const message = action === 'follow' ? `Ќе ја заследите листата ${vm.list.title}.` : `Ќе престанете да ја следите листата ${vm.list.title}.`;

        const confirm = $mdDialog.confirm()
          .title('Следење листа')
          .textContent(message)
          .targetEvent($event)
          .ok('Важи')
          .cancel('Откажи');
        
        return $mdDialog.show(confirm)
        .then(() => {
          return $http.post(`api/playlists.php?endpoint=${action}`, {
            playlistId: parseInt(vm.list.playlistId),
            userId: parseInt(vm.user.id)
          })
        })
        .then((response) => {
          if (response.data.already_following) {
            return;
          }

          const content = action === 'follow' ? 'Ја заследивте оваа листа.' : 'Ја одследивте оваа листа.'
          $mdToast.show(
            $mdToast.simple()
            .textContent(content)
            .position('bottom right')
          );
          vm.isFollowing = !vm.isFollowing;
        })
      }
    }
  }
}