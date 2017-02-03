app
.component('navbar', {
  templateUrl: './components/navbar/navbar.html',
  controllerAs: '$ctrl',
  controller: function(Auth, $rootScope) {
    var $ctrl = this;

    $ctrl.isLoggedIn = $rootScope.isLoggedIn;

    $rootScope.$on('user:logout', function() {
      $ctrl.isLoggedIn = $rootScope.isLoggedIn;
    });

    $rootScope.$on('user:login', function() {
      $ctrl.isLoggedIn = $rootScope.isLoggedIn;
    });

  }
})
.component('playlistCard', {
  templateUrl: './components/playlists/playlist-card/playlist.card.template.html',
  controllerAs: '$ctrl',
  bindings: {
    playlist: '='
  },
  controller: function($sce) {
    var $ctrl = this;
  }
})
.component('currentSong', {
  templateUrl: './components/playlists/current-song/current.song.template.html',
  controllerAs: '$ctrl',
  bindings: {
    song: '=',
    playlist: '<'
  },
  controller: function() {
    var $ctrl = this;

  }
})
.component('playlistSongs', {
  templateUrl: './components/playlists/playlist-songs/playlist.songs.template.html',
  controllerAs: '$ctrl',
  bindings: {
    songs: '=',
    currentSong: '='
  },
  controller: function() {
    var $ctrl = this;

    $ctrl.playSong = function(song) {
      $ctrl.currentSong = song;
    }
  }
})
.component('playSongWidget', {
  templateUrl: './components/playlists/play-song-widget/play-song-widget.template.html',
  controllerAs: '$ctrl',
  controller: function() {
    var $ctrl = this;
  }
})
.component('songsAutocomplete', {
  templateUrl: '../../components/songs/songs.autocomplete.html',
  controllerAs: '$ctrl',
  bindings: {
    list: '='
  },
  controller: function($http) {
    var $ctrl = this;

    $ctrl.lookupSongs = function(text) {
      var uri = `/api/songs.php?endpoint=search&q=${text}`;
      return $http.get(uri)
      .then(function(result) {
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
})
