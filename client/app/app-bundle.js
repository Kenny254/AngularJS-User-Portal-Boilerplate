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
app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider
      .when('/', { templateUrl: 'app/dashboard/dashboard.tpl.html', controller: 'dashboardCtrl' })
      .when('/login', { templateUrl: 'common/security/login/login.tpl.html', controller: 'loginCtrl' })
      .when('/profile', { templateUrl: 'app/account/profile.tpl.html', controller: 'profileCtrl' })
      .when('/sample', { templateUrl: 'app/sample/sample.tpl.html' })
      .when('/sample2', { templateUrl: 'app/sample/sample2.tpl.html' })
      .otherwise({
          redirectTo: '/'
      });
  }
]);
angular.module('app').controller('dashboardCtrl', ['$scope', 'dashboardService', 'security.service',
  function ($scope, svc, security) {
      $scope.title = 'Welcome to the User Portal AngularJS Boilerplate!';
      $scope.user = security.requestCurrentUser();

      svc.getDashData($scope.user.userId).then(function (d) {
          $scope.dashData = d;
      }); 
  }
]);

// *Note: separate this service to it's own file 'dashboard.service.js' after adding more code.
angular.module('app').factory('dashboardService', ['$http', 'services.utilities',
  function ($http, utils) {

      // Simply displaying how a service can be used to get data to a controller.
      var service = {

          getDashData: function (userId) {
              if (userId && userId > 0) {

                  var dashData = {
                      totalHits: 25,
                      totalShares: 6
                  };

                  // Return as a promise.
                  return utils.setAsPromise(dashData);
              }
          }
      };

      return service;
  }
]);
angular.module('app').controller('profileCtrl', ['$scope', 'security.service',
  function ($scope, security) {
      $scope.user = security.requestCurrentUser();
  }
]);
angular.module('app').controller('registerCtrl', ['$scope', 'registerService', '$modalInstance',
  function ($scope, svc, $modalInstance) {
      $scope.user = {};

      $scope.register = function () {
          $scope.dataLoading = true;
          if (svc.createUser($scope.user)) {
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
  }
]);

// *Note: separate this service to it's own file 'register.service.js' after adding more code.
angular.module('app').factory('registerService', ['$http', '$q', 'services.utilities',
  function ($http, $q, utils) {

      var service = {

          createUser: function (user) {
              if (user && user.email && user.password) {
                  return true;
                  // ToDo:
                  //$http.post('/create-user', { user: user })
                  //    .then(function success(response) {
                  //        return true;
                  //    },
                  //    function error(response) {
                  //        utils.handleApiError(response);
                  //        return false;
                  //    });
              }
          }
      };

      return service;
  }
]);
angular.module('app').factory('security.service', ['$http', 'services.utilities',
  function ($http, utils) {

      var service = {

          currentUser: null, // Information about the current user

          // Attempt to authenticate a user by the given email and password
          login: function (email, password) {
              // ToDo: call API
              //$http.post('/login', { email: email, password: password });

              return $http.get('/client/test/sampleData/user.json')
                  .then(function success(response) {
                      service.currentUser = response.data;
                      if (service.isAuthenticated()) {
                          utils.navigateTo('#/');
                      }
                      return service.isAuthenticated();
                  },
                  function error(response) {
                      utils.handleApiError(response);
                      return false;
                  });
          },

          // Logout the current user and redirect
          logout: function () {
              // ToDo: call API
              //$http.post('/logout').then(function () {
                  service.currentUser = null;
                  utils.navigateTo('/login');
              //});
          },

          sendPswdRecoveryEmail: function (email) {
              return true;
              // ToDo: call API
              //$http.get('/password-recovery', { email: email })
          },

          // Ask the backend to see if a user is already authenticated - this may be from a previous session.
          requestCurrentUser: function () {
              if (service.isAuthenticated()) {
                  return service.currentUser;
              }
              // ToDo:
              //else {
              //    return $http.get('/current-user').then(function (response) {
              //        service.currentUser = response.data.user;
              //        return service.currentUser;
              //    });
              //}
          },

          // Is the current user authenticated?
          isAuthenticated: function () {
              return !!service.currentUser;
          }
      };

      return service;
  }
]);
angular.module('app').controller('loginCtrl', ['$scope', 'security.service', '$modal',
  function ($scope, security, $modal) {
      $('#loginModal').modal('show');
      $scope.user = {
          email: 'fake@myemail.com',  // ToDo: remove
          password: 'pa$$word'  // ToDo: remove
      };
      $scope.forgotPass = {};

      $scope.login = function () {
          $scope.dataLoading = true;
          if (security.login($scope.user.email, $scope.user.password)) {
              $('#loginModal').modal('hide');
          } else {
              $scope.loginMsg = 'Login failed. Please try again.';
              $scope.dataLoading = false;
          }
      };

      $scope.forgotPassword = function () {
          if (security.sendPswdRecoveryEmail($scope.forgotPass.email)) {
              $scope.forgotPassMsg = 'A password recovery email has been sent.';
              $scope.forgotPassMsgClass = 'alert-success';
          } else {
              $scope.forgotPassMsg = 'Form submission error. Please try again.';
              $scope.forgotPassMsgClass = 'alert-danger';
          }
      };

      $scope.openRegister = function () {
          var modalInstance = $modal.open({
              //scope: $scope,
              templateUrl: '/client/app/account/register.tpl.html',
              controller: 'registerCtrl'
          });
      };
  }
]);
angular.module('app').factory('services.utilities', ['$rootScope', '$q', '$window', '$location', '$anchorScroll', '$modal',
  function ($rootScope, $q, $window, $location, $scroll, $modal) {

      var service = {
          rootLocationPath: '/client/#',
          pageWidth: $window.innerWidth,

          navigateTo: function (path) {
              $location.path(path);
          },

          pageRedirect: function (path) {
              if (path)
                  $window.location.href = path;
              else
                  $window.location.href = service.rootLocationPath + $location.$$path;
          },

          goBack: function () {
              $window.history.back();
          },

          anchorScroll: function (anchor) {
              $location.hash(anchor);
              $scroll();
          },

          setAsPromise: function (object) {
              var deferred = $q.defer();
              deferred.resolve(object);
              return deferred.promise;
          },

          handleApiError: function (response) {
              if (response) {
                  var errorMessage = response.statusText + ' (Error Code: ' + response.status + ')';
                  if (response.data != null && response.data.message != null)
                      errorMessage += '<br/><br/>' + response.data.message;
                  service.showModalMessage(errorMessage, 'danger', null);
                  console.log(errorMessage); 
              }
          },

          showModalMessage: function (message, type, title, size)  {
              $rootScope.modalTitle = title;
              $rootScope.modalMessage = message;
              $rootScope.type = type; // warning, danger, (theme default)
              size = (!size) ? '' : size;

              var modalInstance = $modal.open({
                  scope: $rootScope,
                  templateUrl: '/client/common/templates/modalMessage.tpl.html',
                  controller: 'modalMessageCtrl',
                  backdrop: 'static', // makes it truly modal so clicks outside the modal don't close it
                  size: size // sm, md, lg
              });
          }
      };

      return service;
  }
]);
angular.module('app').controller('modalMessageCtrl', function ($scope, $modalInstance) {

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

    $scope.close = function () {
        $modalInstance.close();
    };
});