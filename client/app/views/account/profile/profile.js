(function (app) {
    'use strict';

    app.controller('profileController', profileController);
    profileController.$inject = ['securityService'];

    function profileController(security) {
        var vm = this;

        function init() {
            vm.user = security.getCurrentUser();
        }

        init();
    }
})(angular.module('app'));