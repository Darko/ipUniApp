export default class PopularListsController {
  constructor(Popular) {
    'ngInject';

    const vm = this;

    vm.popular = Popular.data;
  }
}