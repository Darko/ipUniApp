export default class NewListsController {
  constructor(New) {
    'ngInject';

    const vm = this;
    
    vm.new = New.data;
  }
}