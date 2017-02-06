export default {
  templateUrl: './client/components/playlists/playlist-songs/playlist.songs.template.html',
  bindings: {
    songs: '=',
    currentSong: '='
  },
  controllerAs: '$ctrl',
  controller: PlaylistSongsController
}

function PlaylistSongsController (Auth, $rootScope) {
  'ngInject';
  const $ctrl = this;

  $ctrl.playSong = function(song) {
    $ctrl.currentSong = song;
  }
}