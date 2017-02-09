export default {
  templateUrl: './client/components/playlists/playlist-songs/playlist.songs.template.html',
  bindings: {
    list: '=',
    currentSong: '=',
    following: '='
  },
  controllerAs: 'vm',
  controller: PlaylistSongsController
}

function PlaylistSongsController (Auth, $rootScope, PlayerService) {
  'ngInject';
  const vm = this;

  vm.loggedIn = Auth.isAuthenticated();
  vm.user = Auth.getCurrentUser();

  vm.playSong = function(song) {
    vm.currentSong = song;
    PlayerService.playSong({
      playlist: vm.list,
      song: vm.currentSong
    });
  }

  vm.isOwner = function() {
    return vm.user ? parseInt(vm.list.userId) === parseInt(vm.user.id) : false;
  }

}