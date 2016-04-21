(function (app) {
    'use strict';

    app.controller('loginController', loginController);
    loginController.$inject = ['securityService', '$modal'];

    function loginController(security, $modal) {
        var vm = this;

        function init() {
            $('#loginModal').modal('show');
            vm.forgotPass = {};

            vm.user = {
                email: 'fake@myemail.com',  // ToDo: remove
                password: 'pa$$word'  // ToDo: remove
            };
        }

        vm.login = function () {
            vm.dataLoading = true;

            security.login(vm.user.email, vm.user.password)
                .then(function (response) {
                    if (response && response.data) {
                        $('#loginModal').modal('hide');
                    }
                }, function (error) {
                    vm.loginMsg = 'Login failed. Please try again.';
                    vm.dataLoading = false;
                });
        };

        vm.forgotPassword = function () {
            if (security.sendPswdRecoveryEmail(vm.forgotPass.email)) {
                vm.forgotPassMsg = 'A password recovery email has been sent.';
                vm.forgotPassMsgClass = 'alert-success';
            } else {
                vm.forgotPassMsg = 'Form submission error. Please try again.';
                vm.forgotPassMsgClass = 'alert-danger';
            }
        };

        vm.openRegister = function () {
            var modalInstance = $modal.open({
                //scope: $scope,
                templateUrl: '/client/app/views/account/register/register.tpl.html',
                controller: 'registerController'
            });
        };

        init();
    }
})(angular.module('app'));