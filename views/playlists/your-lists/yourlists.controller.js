export default class YourListsController {
  constructor(Lists) {
    'ngInject';
    
    const vm = this;
    
    vm.lists = Lists.data;
  }
}