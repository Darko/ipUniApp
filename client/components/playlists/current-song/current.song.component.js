export default {
  templateUrl: './client/components/playlists/current-song/current.song.template.html',
  controllerAs: 'vm',
  controller: CurrentSongController,
  bindings: {
    song: '=',
    playlist: '='
  }
}

function CurrentSongController (Auth, $rootScope) {
  'ngInject';
  const vm = this;

}