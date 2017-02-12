export default class HomePageController {
  constructor(New, Popular, Auth) {
    'ngInject';

    const vm = this;

    vm.loggedIn = Auth.isAuthenticated();
    vm.new = New.data;
    vm.popular = Popular.data;
  }
}