export default class PlayerService {
  constructor($rootScope) {
    const _this = this;

    this.current = {
      playlist: null,
      song: null
    }

    this.playSong = function(data) {
      this.current = data;
      $rootScope.$broadcast('player:play', _this.current);
    }

    this.getCurrent = function() {
      return _this.current;
    }

    this.getPlaylist = function() {
      return _this.current.playlist;
    }

    this.getCurrentSong = function() {
      return _this.current.song;
    }

    this.setCurrentSong = function(song) {
      _this.current.song = song;
    }

    this.stopPlaying = function(player) {
      player.isPlaying = false;
    }

    return _this;
  }
}