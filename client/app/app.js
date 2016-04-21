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