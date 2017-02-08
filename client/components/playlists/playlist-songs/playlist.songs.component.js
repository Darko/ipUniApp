export default {
  templateUrl: './client/components/playlists/playlist-songs/playlist.songs.template.html',
  bindings: {
    list: '=',
    currentSong: '=',
    following: '='
  },
  controllerAs: '$ctrl',
  controller: PlaylistSongsController
}

function PlaylistSongsController (Auth, $rootScope) {
  'ngInject';
  const $ctrl = this;

  $ctrl.loggedIn = Auth.isAuthenticated();
  $ctrl.user = Auth.getCurrentUser();

  $ctrl.playSong = function(song) {
    $ctrl.currentSong = song;
  }

  $ctrl.isOwner = function() {
    return $ctrl.user ? parseInt($ctrl.list.userId) === parseInt($ctrl.user.id) : false;
  }

}