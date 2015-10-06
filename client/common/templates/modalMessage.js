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