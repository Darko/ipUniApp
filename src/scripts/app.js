var app = angular.module('MusicApp', [

]);

app.component('navbar', {
    templateUrl: './components/navbar/navbar.html',
    controllerAs: '$ctrl',
    controller: function() {
        var $ctrl = this;
    }
})