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