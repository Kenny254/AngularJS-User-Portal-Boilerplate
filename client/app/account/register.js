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