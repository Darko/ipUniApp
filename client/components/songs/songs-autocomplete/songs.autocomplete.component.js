import _ from 'lodash';

export default {
  templateUrl: './client/components/songs/songs-autocomplete/songs.autocomplete.html',
  bindings: {
    list: '='
  },
  controllerAs: 'vm',
  controller: SongsAutocompleteController
}

function SongsAutocompleteController (Auth, $rootScope, $http) {
  'ngInject';
  const vm = this;
  
  vm.lookupSongs = function(text) {
    var uri = `/api/songs.php?endpoint=search&q=${text}`;
    return $http.get(uri)
    .then(result => {
      return result.data || [];
    })
  }

  vm.addToSongs = function(song) {
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

    if (vm.list.items) {
      vm.list.items.push(newSong);
    } else {
      vm.list.items = [];
      vm.list.items.push(newSong);
    }
    vm.searchText = '';
  }

  vm.removeSong = function(song) {
    _.remove(vm.list.items, song);
  }
}