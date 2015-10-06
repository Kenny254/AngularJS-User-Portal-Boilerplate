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