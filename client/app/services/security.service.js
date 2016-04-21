(function () {
    angular
        .module('app')
        .factory('securityService', securityService);

    securityService.$inject = ['$http', 'commonService'];

    function securityService($http, commonService) {
        var currentUser = null; // Information about the current user

        return {
            login: login,
            logout: logout,
            sendPswdRecoveryEmail: sendPswdRecoveryEmail,
            getCurrentUser: getCurrentUser,
            isAuthenticated: isAuthenticated
        };

        // Attempt to authenticate a user by the given email and password
        function login(email, password) {
            // ToDo: call API
            //$http.post('/login', { email: email, password: password });

            return $http.get('test/sampleData/user.json')
                .then(function success(response) {
                    currentUser = response.data;
                    if (isAuthenticated()) {
                        commonService.navigateTo('#/');
                    }
                    return isAuthenticated();
                },
                function error(response) {
                    commonService.handleApiError(response);
                    return false;
                });
        }

        // Logout the current user and redirect
        function logout() {
            // ToDo: call API
            //$http.post('/logout').then(function () {
            currentUser = null;
            commonService.navigateTo('/login');
            //});
        }

        function sendPswdRecoveryEmail(email) {
            return true;
            // ToDo: call API
            //$http.get('/password-recovery', { email: email })
        }

        // Ask the backend to see if a user is already authenticated - this may be from a previous session.
        function getCurrentUser() {
            if (isAuthenticated()) {
                return currentUser;
            }
            // ToDo:
            //else {
            //    return $http.get('/current-user').then(function (response) {
            //        currentUser = response.data.user;
            //        return currentUser;
            //    });
            //}
        }

        // Is the current user authenticated?
        function isAuthenticated() {
            return !!currentUser;
        }
    }
})();