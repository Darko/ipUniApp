export default class HomePageController {
  constructor(New, Popular, Auth, $http, $mdToast) {
    'ngInject';
    this.$http = $http;
    this.$mdToast = $mdToast;

    const vm = this;

    vm.loggedIn = Auth.isAuthenticated();
    vm.new = New.data;
    vm.popular = Popular.data;

    vm.init();

  }

  init() {
    this.$http.get('api/playlists.php?endpoint=featured')
    .then(result => {
      this.featured = result.data.playlist;      
    })
    .catch(() => {
      this.$mdToast.show(this.$mdToast.simple()
      .textContent('Настана грешка...')
      .position('bottom right'));
    })
  }
}