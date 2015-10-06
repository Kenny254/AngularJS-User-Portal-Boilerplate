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