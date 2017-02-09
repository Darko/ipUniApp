export default {
  templateUrl: './client/components/player/player.template.html',
  controllerAs: 'vm',
  controller: PlayerController
}

function PlayerController ($scope, PlayerService, $interval) {
  'ngInject';
  const vm = this;

  vm.playlist = PlayerService.getPlaylist();
  vm.player = {};

  vm.stats = {
    isPlaying: false,
    isPaused: true,
    songLength: 0,
    currentTime: 0,
    progressed: 0
  }

  let timer;

  $scope.$on('youtube.player.ready', ($event, player) => {
    vm.player = player;
    vm.stats.isPlaying = true;
    vm.init();
  });

  $scope.$on('youtube.player.ended', ($event, player) => {
  });

  $scope.$on('youtube.player.playing', ($event, player) => {
    vm.stats.isPaused = false;
  });

  $scope.$on('youtube.player.paused', ($event, player) => {
    vm.stats.isPaused = true;
  });

  $scope.$on('youtube.player.buffering', ($event, player) => {
  });

  $scope.$on('youtube.player.queued', ($event, player) => {
  });

  $scope.$on('youtube.player.error', ($event, player) => {
  });

  $scope.$on('player:play', (event, data) => {
    vm.stats.isPlaying = true;
    vm.currentSong = data.song;
  });

  $scope.$watch(() => PlayerService.getPlaylist(), playlist => {
    if (playlist) {
      vm.playlist = playlist;
      vm.currentSong = playlist.items[0];
    }
  });

  vm.togglePlayer = function() {
    vm.stats.isPaused ? vm.player.playVideo() : vm.player.pauseVideo();
    vm.stats.isPaused = !vm.stats.isPaused;
  }

  vm.updateStatus = function() {
    vm.stats.songLength = vm.player.getDuration();
    vm.stats.currentTime = vm.player.getCurrentTime();
    vm.stats.progressed = (vm.stats.currentTime / vm.stats.songLength) * 100;
  }

  vm.init = function() {
    vm.updateStatus();
    vm.togglePlayer();

    $interval.cancel(timer);

    timer = $interval(() => {
      vm.updateStatus();
    }, 1000);
  }
  
}