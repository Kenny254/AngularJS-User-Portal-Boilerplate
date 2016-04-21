(function (app) {
    'use strict';

    app.controller('registerController', registerController);
    registerController.$inject = ['$scope', 'registerService', '$modalInstance'];

    function registerController($scope, registerService, $modalInstance) {

        function init() {
            $scope.user = {};
        }

        $scope.register = function () {
            $scope.dataLoading = true;

            if (registerService.createUser($scope.user)) {
                $scope.registerMsg = 'Your account has been created! You can now login.';
                $scope.registerMsgClass = 'alert-success';
            } else {
                $scope.registerMsg = 'Registration failed. Please try again.';
                $scope.registerMsgClass = 'alert-danger';
                $scope.dataLoading = false;
            }
        };

        $scope.close = function () {
            $modalInstance.close();
        };

        init();
    }
})(angular.module('app'));


// *Note: separate this service to it's own file 'register.service.js' after adding more code.
(function () {
    angular
        .module('app')
        .factory('registerService', registerService);

    registerService.$inject = ['$http', 'commonService'];

    function registerService($http, commonService) {

        return {
            createUser: createUser
        };

        function createUser(user) {
            if (user && user.email && user.password) {
                return true;
                // ToDo:
                //$http.post('/create-user', { user: user })
                //    .then(function success(response) {
                //        return true;
                //    },
                //    function error(response) {
                //        commonService.handleApiError(response);
                //        return false;
                //    });
            }
        }
    }
})();