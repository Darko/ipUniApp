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

  vm.stats = {
    open: false,
    paused: true,
    songLength: 0,
    currentTime: 0,
    progressed: 0,
    loop: true,
    volume: {
      muted: false,
      amount: 50
    }
  }

  let timer;

  $scope.$on('youtube.player.ready', ($event, player) => {
    vm.player = player;
    vm.stats.open = true;
    vm.init(player);
    player.playVideo();
    console.log(player);
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
  });

  $scope.$on('youtube.player.paused', ($event, player) => {
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

  vm.updateStatus = function(player) {
    vm.player = player;
    vm.stats.songLength = vm.player.getDuration();
    vm.stats.currentTime = vm.player.getCurrentTime();
    vm.stats.progressed = (vm.stats.currentTime / vm.stats.songLength) * 100;
  }

  vm.init = function(player) {
    vm.updateStatus(player);

    $interval.cancel(timer);

    timer = $interval(() => {
      vm.updateStatus(player);
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
  }
}