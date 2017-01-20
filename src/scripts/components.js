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
    songs: '='
  },
  controller: function() {
    var $ctrl = this;

  }
})
.component('playSongWidget', {
  templateUrl: './components/playlists/play-song-widget/play-song-widget.template.html',
  controllerAs: '$ctrl',
  controller: playSongWidgetController
});


function playSongWidgetController() {
  var $ctrl = this;
}