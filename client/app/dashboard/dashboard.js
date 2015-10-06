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