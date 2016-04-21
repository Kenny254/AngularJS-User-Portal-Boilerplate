(function (app) {
    'use strict';

    app.controller('dashboardController', dashboardController);
    dashboardController.$inject = ['dashboardService', 'securityService'];

    function dashboardController(dashboardService, security) {
        var vm = this;

        function init() {
            vm.title = 'Welcome to the User Portal AngularJS Boilerplate!';
            vm.user = security.getCurrentUser();

            dashboardService.getDashData(vm.user.userId).then(function (d) {
                vm.dashData = d;
            });
        }

        init();
    }
})(angular.module('app'));


// *Note: separate this service to it's own file 'dashboard.service.js' after adding more code.
(function () {
    angular
        .module('app')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$http', 'commonService'];

    function dashboardService($http, commonService) {

        return {
            getDashData: getDashData
        };

        function getDashData(userId) {
            if (userId && userId > 0) {

                var dashData = {
                    totalHits: 25,
                    totalShares: 6
                };

                // Return as a promise.
                return commonService.setDeferredPromise(dashData);
            }
        }
    }
})();