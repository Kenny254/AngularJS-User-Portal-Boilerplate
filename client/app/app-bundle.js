/*************************************************************************************
Angular Application Main module configuration Start
*************************************************************************************/
'use strict';

angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

(function (app) {
    app.run(['securityService', function (security) {
        // Get the current user when the application starts (in case they are still logged in from a previous session)
        security.getCurrentUser();
    }]);

    /***********  Base Controller Start ***********/

    app.controller('baseController', baseController);
    baseController.$inject = ['$scope', '$window', 'securityService', 'commonService'];

    function baseController($scope, $window, security, commonService) {
        var vm = this;

        function init() {
            vm.logoText = 'USER PORTAL';
            vm.currentYear = new Date().getFullYear();
            vm.isSidebarClosed = false;
            vm.settingsLinkGroup = false;
            vm.defaultProfileImage = commonService.APP_CONFIG.DEFAULT_USER_IMG;
            vm.currentUser = security.getCurrentUser();
            vm.isAuthenticated = security.isAuthenticated();
            vm.logout = function () { security.logout(); };
            vm.gotoTop = function () { commonService.anchorScroll('scrollTop'); };

            if ($window.innerWidth < 768) {
                vm.isSidebarClosed = true;
            }
        }

        vm.toggleSidebar = function () {
            if (vm.isSidebarClosed) {
                vm.isSidebarClosed = false;
            } else {
                vm.isSidebarClosed = true;
            }
        };

        init();

        // register listener to watch route changes
        $scope.$on('$routeChangeStart', function (event, next, current) {
            vm.isAuthenticated = security.isAuthenticated();

            if (!security.isAuthenticated() && next.$$route.originalPath.indexOf('login') == -1) {
                commonService.navigateTo('/login');
                return;
            } else {
                vm.currentUser = security.getCurrentUser();
            }

            // Set the Sidebar Nav active styles based on current page
            if (next && next.$$route && next.$$route.originalPath) {

                // Reset every time
                vm.activateDashboardNav = vm.activateSettingsNav = vm.settingsLinkGroup =
                vm.activateSampleSubNav = vm.activateSample2SubNav = false;

                switch (next.$$route.originalPath) {
                    case '/sample':
                        vm.activateSettingsNav = vm.settingsLinkGroup = vm.activateSampleSubNav = true;
                        break;
                    case '/sample2':
                        vm.activateSettingsNav = vm.settingsLinkGroup = vm.activateSample2SubNav = true;
                        break;
                    default:
                        vm.activateDashboardNav = true;
                        break;
                }
            }
        });
    }

    /***********  Base Controller End ***********/

    app.animation('.ajs-fade-animation', function () {
        return {
            enter: function (element, done) {
                element.css('display', 'none');
                element.fadeIn(500, done);
                return function () {
                    element.stop();
                }
            },
            leave: function (element, done) {
                element.fadeOut(500, done)
                return function () {
                    element.stop();
                }
            }
        }
    });

})(angular.module('app'));
angular.module('app')
    .constant('APP_CONFIG',
    {
        DEFAULT_USER_IMG: 'content/img/avatar.jpg'
    });

(function () {
    /***********************************************************
    Route configuration Start    
    ***********************************************************/
    angular.module('app').config(['$routeProvider', routeConfig]);

    function routeConfig($routeProvider) {
        $routeProvider
          .when('/', { templateUrl: 'app/views/dashboard/dashboard.tpl.html', controller: 'dashboardController', controllerAs: 'vm' })
          .when('/login', { templateUrl: 'app/views/account/security/login/login.tpl.html', controller: 'loginController', controllerAs: 'vm' })
          .when('/profile', { templateUrl: 'app/views/account/profile/profile.tpl.html', controller: 'profileController', controllerAs: 'vm' })
          .when('/sample', { templateUrl: 'app/views/sample/sample.tpl.html' })
          .when('/sample2', { templateUrl: 'app/views/sample/sample2.tpl.html' })
          .otherwise({
              redirectTo: '/'
          });
    }
    /***********************************************************
    Route configuration End
    ***********************************************************/
})();
angular
  .module('app')
  .filter('cmdate', ['$filter', function ($filter) {
      return function (input, format) {
          return $filter('date')(new Date(input), format);
      };
  }]);
(function () {
    angular
        .module('app')
        .factory('commonService', commonService);

    commonService.$inject = ['$rootScope', '$q', '$window', '$location',  '$anchorScroll', '$modal', 'APP_CONFIG'];

    function commonService($rootScope, $q, $window, $location, $anchorScroll, $modal, APP_CONFIG) {
        var rootLocationPath = '/#';

        return {
            APP_CONFIG: APP_CONFIG,
            navigateTo: navigateTo,
            pageRedirect: pageRedirect,
            goBack: goBack,
            anchorScroll: anchorScroll,
            setDeferredPromise: setDeferredPromise,
            showModalMessage: showModalMessage,
            handleApiError: handleApiError,
            setQueryStringValue: setQueryStringValue,
            getQueryStringValue: getQueryStringValue
        };

        function navigateTo(path) {
            $location.path(path);
        }

        function pageRedirect(path) {
            if (path)
                $window.location.href = path;
            else
                $window.location.href = rootLocationPath + $location.$$path;
        }

        function goBack() {
            $window.history.back();
        }

        function anchorScroll(anchor) {
            $location.hash(anchor);
            $scroll();
        }

        function setDeferredPromise(object) {
            var deferred = $q.defer();
            deferred.resolve(object);
            return deferred.promise;
        }

        function showModalMessage(message, type, title, size) {
            $rootScope.modalTitle = title;
            $rootScope.modalMessage = message;
            $rootScope.type = type; // warning, danger, (theme default)
            size = (!size) ? '' : size;

            var modalInstance = $modal.open({
                scope: $rootScope,
                templateUrl: '/client/app/views/common/modalMessage/modalMessage.tpl.html',
                controller: 'modalMessageCtrl',
                backdrop: 'static', // makes it truly modal so clicks outside the modal don't close it
                size: size // sm, md, lg
            });
        }

        function handleApiError(response) {
            if (response) {
                var errorMsg = response.statusText + ' (Error Code: ' + response.status + ')';
                if (response.data !== null && response.data.message !== null) {
                    errorMsg += '<br/><br/>' + response.data.message;
                }

                showModalMessage(errorMsg, 'danger', 'Failure');
                console.log(errorMsg);
            }
        }

        function setQueryStringValue(name, value) {
            $location.search(name, value);
        }

        function getQueryStringValue(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec($location.absUrl().replace('#', ''));

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
    }
})();
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
(function (app) {
    'use strict';

    app.controller('modalMessageCtrl', modalMessageCtrl);
    modalMessageCtrl.$inject = ['$scope', '$modalInstance'];

    function modalMessageCtrl($scope, $modalInstance) {

        function init() {
            switch ($scope.type) {
                case 'warning':
                    $scope.modalContentClass = 'alert-warning';
                    $scope.modalHeaderClass = 'modal-header-warning';

                    if (!$scope.modalTitle)
                        $scope.modalTitle = "Warning";
                    break;
                case 'danger':
                    $scope.modalContentClass = 'alert-danger';
                    $scope.modalHeaderClass = 'modal-header-danger';

                    if (!$scope.modalTitle)
                        $scope.modalTitle = "Error";
                    break;
                default:
                    if (!$scope.modalTitle)
                        $scope.modalTitle = "Information";
                    break;
            }
        }

        $scope.close = function () {
            $modalInstance.close();
        };

        init();
    }
})(angular.module('app'));
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