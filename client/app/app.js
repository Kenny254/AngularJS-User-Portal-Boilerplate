var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.run(['security.service', function (security) {
    // Get the current user when the application starts (in case they are still logged in from a previous session)
    security.requestCurrentUser();
}]);

app.controller('baseCtrl', ['$scope', 'security.service', 'services.utilities',
  function ($scope, security, utils) {
      $scope.logoText = 'USER PORTAL';
      $scope.currentYear = new Date().getFullYear();
      $scope.isSidebarClosed = false;
      $scope.settingsLinkGroup = false;
      $scope.currentUser = security.requestCurrentUser();
      $scope.isAuthenticated = security.isAuthenticated();
      $scope.logout = function () { security.logout(); };
      $scope.gotoTop = function () { utils.anchorScroll('scrollTop'); };

      if (utils.pageWidth < 768) {
          $scope.isSidebarClosed = true;
      }

      $scope.toggleSidebar = function () {
          if ($scope.isSidebarClosed) {
              $scope.isSidebarClosed = false;
          } else {
              $scope.isSidebarClosed = true;
          }
      };

      // register listener to watch route changes
      $scope.$on('$routeChangeStart', function (event, next, current) {
          $scope.isAuthenticated = security.isAuthenticated();

          if (!security.isAuthenticated() && next.$$route.originalPath.indexOf('login') == -1) {
              utils.navigateTo('/login');
              return;
          } else {
              $scope.currentUser = security.requestCurrentUser();
          }

          // Set the Sidebar Nav active styles based on current page
          if (next && next.$$route && next.$$route.originalPath) {

              // Reset every time
              $scope.activateDashboardNav = $scope.activateSettingsNav = $scope.settingsLinkGroup =
              $scope.activateSampleSubNav = $scope.activateSample2SubNav = false;

              switch (next.$$route.originalPath) {
                  case '/sample':
                      $scope.activateSettingsNav = $scope.settingsLinkGroup = $scope.activateSampleSubNav = true;
                      break;
                  case '/sample2':
                      $scope.activateSettingsNav = $scope.settingsLinkGroup = $scope.activateSample2SubNav = true;
                      break;
                  default:
                      $scope.activateDashboardNav = true;
                      break;
              }
          }
      });
  }
]);

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