export default class IndexController {
  constructor($scope) {
    'ngInject';

    const vm = this;

    const elementWrapper = document.querySelector('#play-song-widget');

    vm.player = {
      isPlaying: false,
      isPaused: false
    }  
    
    $scope.$on('playlist:play', (event, data) => {

    });

    vm.startPlaying = function() {}
  }
}