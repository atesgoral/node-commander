define([
    'angular',
    'nc',
    'pane/pane',
    'list/list',
    'less!./main'
], function (angular, nc) {
    'use strict';

    nc.run([ '$rootScope', '$q', function ($rootScope, $q) {
        $rootScope.panes = [{
            tabs: [{
            //}, {
            }]
        }, {
            tabs: [{
            }]
        }];

        $rootScope.restoreFocus = function () {
            $rootScope.panes[0].$element[0].focus(); // @todo preserve previous focused tab
        };

        // @todo use $window?
        angular.element(window).on('focus', function (evt) {
            $rootScope.restoreFocus();
        });
    }]);

    angular.bootstrap(document, [ 'nc' ]);
});
