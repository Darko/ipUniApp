export default {
  templateUrl: './client/components/playlists/current-song/current.song.template.html',
  controllerAs: '$ctrl',
  controller: CurrentSongController,
  bindings: {
    song: '=',
    playlist: '='
  }
}

function CurrentSongController (Auth, $rootScope) {
  'ngInject';
  const $ctrl = this;

}