(function () {
    angular
        .module('app')
        .factory('commonService', commonService);

    commonService.$inject = ['$rootScope', '$q', '$window', '$location',  '$anchorScroll', '$modal', 'APP_CONFIG'];

    function commonService($rootScope, $q, $window, $location, $anchorScroll, $modal, APP_CONFIG) {
        var rootLocationPath = '/#';

        return {
            APP_CONFIG: APP_CONFIG,
            navigateTo: navigateTo,
            pageRedirect: pageRedirect,
            goBack: goBack,
            anchorScroll: anchorScroll,
            setDeferredPromise: setDeferredPromise,
            showModalMessage: showModalMessage,
            handleApiError: handleApiError,
            setQueryStringValue: setQueryStringValue,
            getQueryStringValue: getQueryStringValue
        };

        function navigateTo(path) {
            $location.path(path);
        }

        function pageRedirect(path) {
            if (path)
                $window.location.href = path;
            else
                $window.location.href = rootLocationPath + $location.$$path;
        }

        function goBack() {
            $window.history.back();
        }

        function anchorScroll(anchor) {
            $location.hash(anchor);
            $scroll();
        }

        function setDeferredPromise(object) {
            var deferred = $q.defer();
            deferred.resolve(object);
            return deferred.promise;
        }

        function showModalMessage(message, type, title, size) {
            $rootScope.modalTitle = title;
            $rootScope.modalMessage = message;
            $rootScope.type = type; // warning, danger, (theme default)
            size = (!size) ? '' : size;

            var modalInstance = $modal.open({
                scope: $rootScope,
                templateUrl: '/client/app/views/common/modalMessage/modalMessage.tpl.html',
                controller: 'modalMessageCtrl',
                backdrop: 'static', // makes it truly modal so clicks outside the modal don't close it
                size: size // sm, md, lg
            });
        }

        function handleApiError(response) {
            if (response) {
                var errorMsg = response.statusText + ' (Error Code: ' + response.status + ')';
                if (response.data !== null && response.data.message !== null) {
                    errorMsg += '<br/><br/>' + response.data.message;
                }

                showModalMessage(errorMsg, 'danger', 'Failure');
                console.log(errorMsg);
            }
        }

        function setQueryStringValue(name, value) {
            $location.search(name, value);
        }

        function getQueryStringValue(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                results = regex.exec($location.absUrl().replace('#', ''));

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
    }
})();