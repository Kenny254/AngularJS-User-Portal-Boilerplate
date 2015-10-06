angular.module('app').controller('profileCtrl', ['$scope', 'security.service',
  function ($scope, security) {
      $scope.user = security.requestCurrentUser();
  }
]);