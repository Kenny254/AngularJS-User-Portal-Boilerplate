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