(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        

        initController();

        function initController() {
            
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

    }

})();