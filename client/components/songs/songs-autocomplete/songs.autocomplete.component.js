import _ from 'lodash';

export default {
  templateUrl: './client/components/songs/songs-autocomplete/songs.autocomplete.html',
  bindings: {
    list: '='
  },
  controllerAs: '$ctrl',
  controller: SongsAutocompleteController
}

function SongsAutocompleteController (Auth, $rootScope) {
  'ngInject';
  const $ctrl = this;
  
  $ctrl.lookupSongs = function(text) {
    var uri = `/api/songs.php?endpoint=search&q=${text}`;
    return $http.get(uri)
    .then(result => {
      return result.data || [];
    })
  }

  $ctrl.addToSongs = function(song) {
    var newSong = undefined;
    if (!parseInt(song.id)) {
      newSong = {
        videoId: song.id.videoId,
        snippet: {
          title: song.snippet.title,
          channelTitle: song.snippet.channelTitle,
          thumbnail: song.snippet.thumbnails.high.url
        }
      }
    } else {
      newSong = song;
    }

    $ctrl.list.items.push(newSong);
    $ctrl.searchText = '';
  }

  $ctrl.removeSong = function(song) {
    _.remove($ctrl.list.items, song);
  }
}