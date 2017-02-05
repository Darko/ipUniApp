export default {
  templateUrl: './components/playlists/playlist-card/playlist.card.template.html',
  bindings: {
    playlist: '='
  },
  controllerAs: '$ctrl',
  controller: PlaylistCardController
}

function PlaylistCardController (Auth, $rootScope) {
  'ngInject';
  const $ctrl = this;
}