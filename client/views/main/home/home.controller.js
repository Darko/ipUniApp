export default class HomePageController {
  constructor(Your, New, Popular, Auth) {
    'ngInject';

    const vm = this;

    vm.loggedIn = Auth.isAuthenticated();

    vm.your = Your.data;
    vm.new = New.data;
    vm.popular = Popular.data;
  }
}