define([
    'angular',
    'pane/pane',
    'list/list',
    'less!./main'
], function (angular) {
    'use strict';

    angular.module('nc.app', []).run([ '$rootScope', '$q', function ($rootScope, $q) {
        $rootScope.panes = [{
            tabs: [{
            }, {
            }]
        }, {
            tabs: [{
            }]
        }];

        $rootScope.restoreFocus = function () {
            $rootScope.panes[0].$element[0].focus(); // @todo preserve previous focused tab
        };

        angular.element(window).on('focus', function (evt) {
            $rootScope.restoreFocus();
        });
    }]);

    angular.bootstrap(document, [
        'nc.app',
        'nc.pane',
        'nc.list'
    ]);
});
