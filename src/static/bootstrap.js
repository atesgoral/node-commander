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
                sourceUrl: 'file://foo',
                files: [{
                    name: "doge",
                    ext: "jpg",
                    size: "43210",
                    date: new Date()
                }, {
                    name: "nyan",
                    ext: "gif",
                    size: "65535",
                    date: new Date()
                }]
            }, {
                sourceUrl: 'file://bar',
                files: [{
                    name: "apple",
                    ext: "jpg",
                    size: "13000",
                    date: new Date()
                }, {
                    name: "banana",
                    ext: "jpg",
                    size: "17453",
                    date: new Date()
                }, {
                    name: "orange",
                    ext: "jpg",
                    size: "34222",
                    date: new Date()
                }]
            }]
        }, {
            tabs: [{
                sourceUrl: 'file://baz',
                files: [{
                    name: "jquery",
                    ext: "js",
                    size: "143210",
                    date: new Date()
                }, {
                    name: "angular",
                    ext: "js",
                    size: "223406",
                    date: new Date()
                }]
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
