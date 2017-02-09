import _ from 'lodash';

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
  vm.storage = localStorage;

  vm.stats = {
    open: false,
    paused: true,
    songLength: 0,
    currentTime: 0,
    loop: false,
    volume: {
      muted: false,
      amount: parseInt(_.get(vm.storage, 'donger.volume')) || 50
    }
  }

  let timer;

  $scope.$on('youtube.player.ready', ($event, player) => {
    vm.player = player;
    vm.stats.open = true;
    vm.init(player);
    player.setVolume(vm.stats.volume.amount);
    player.playVideo();
    vm.stats.songLength = vm.player.getDuration();
  });

  $scope.$on('youtube.player.ended', ($event, player) => {
    vm.stats.paused = true;
    if (vm.isLastSong()) {
      if (vm.stats.loop) {
        vm.currentSong = vm.playlist.items[0];
        vm.init(player);
        player.playVideo();
      }
    } else {
      const index = vm.getCurrentIndex();
      vm.currentSong = vm.playlist.items[index + 1];
      player.playVideo();
    }
  });

  $scope.$on('youtube.player.playing', ($event, player) => {
    vm.stats.paused = false;
    vm.player = player;
  });

  $scope.$on('youtube.player.paused', ($event) => {
    vm.stats.paused = true;
  });

  $scope.$on('player:play', (event, data) => {
    vm.stats.open = true;
    vm.currentSong = data.song;
  });

  $scope.$watch(() => PlayerService.getPlaylist(), playlist => {
    if (playlist) {
      vm.playlist = playlist;
    }
  });

  $scope.$watch(() => PlayerService.getCurrentSong(), song => {
    if (song) {
      vm.currentSong = song;
    }
  })

  vm.togglePlayer = function() {
    vm.stats.paused ? vm.player.playVideo() : vm.player.pauseVideo();
    vm.stats.paused = !vm.stats.paused;
  }

  vm.updateStatus = function() {
    if (vm.stats.paused) return;
    vm.stats.currentTime = Math.round(vm.player.getCurrentTime());
  }

  vm.init = function(player) { // Bootstrap player 
    vm.player = player;
    vm.updateStatus();

    $interval.cancel(timer);

    timer = $interval(() => {
      vm.updateStatus();
    }, 1000);
  }

  vm.isLastSong = function() {
    const lastIndex = vm.playlist.items.length - 1;
    return _.isEqual(vm.currentSong, vm.playlist.items[lastIndex]);
  }

  vm.getCurrentIndex = function() {
    return _.indexOf(vm.playlist.items, vm.currentSong);
  }

  vm.changeVolume = function(amount = null) {
    if (amount === 'toggle') {
      vm.stats.volume.muted = !vm.stats.volume.muted;
      if (vm.stats.volume.muted) {
        vm.stats.volume.previousVolume = vm.stats.volume.amount;
        vm.stats.volume.amount = 0;
      } else {
        vm.stats.volume.amount = vm.stats.volume.previousVolume; 
      }
    }
    vm.player.setVolume(vm.stats.volume.amount);
    vm.storage.setItem('donger.volume', vm.stats.volume.amount);
  }

  vm.goto = function() {
    vm.player.seekTo(vm.stats.currentTime);
  }

  vm.skip = function(dest) {
    dest === 'next' ? goNext() : goPrev();
  }

  function goNext() {
    const index = vm.getCurrentIndex();
    if (index < vm.playlist.items.length - 1) {
      vm.currentSong = vm.playlist.items[index + 1];
    }
    return;
  }

  function goPrev() {
    const index = vm.getCurrentIndex();
    if (index > 0) {
      vm.currentSong = vm.playlist.items[index - 1];
    }
    return;
  }

}