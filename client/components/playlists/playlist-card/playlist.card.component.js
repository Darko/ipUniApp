export default {
  templateUrl: './client/components/playlists/playlist-card/playlist.card.template.html',
  bindings: {
    playlist: '='
  },
  controllerAs: 'vm',
  controller: PlaylistCardController
}

function PlaylistCardController () {
  'ngInject';
  const vm = this;

}
