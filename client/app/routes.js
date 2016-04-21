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