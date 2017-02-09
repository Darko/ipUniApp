export default class PlayerService {
  constructor($rootScope) {
    const _this = this;

    this.current = {
      playlist: null,
      song: null
    }

    this.play = function(data) {
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

    this.setPlaylist = function(playlist) {
      _this.current.playlist = playlist;
    }

    this.closePlayer = function(player) {
      player.open = false;
    }

    return _this;
  }
}