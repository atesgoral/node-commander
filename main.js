require.config({
    paths: {
        text: 'bower_components/requirejs-text/text',
        angular: 'bower_components/angular/angular.min',
        less: 'bower_components/less/dist/less-1.7.0.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        less: {
            exports: 'less'
        }
    }
});

require([
    'angular',
    'less',
    'widgets/pane',
    'widgets/list'
], function (ng) {
    'use strict';

    ng.module('nc.app', []).run([ '$rootScope', '$q', function ($rootScope, $q) {
        $rootScope.panes = {
            left: {
                name: 'left',
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
            },
            right: {
                name: 'right',
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
            }
        };
    }]);

    ng.bootstrap(document, [
        'nc.app',
        'nc.pane',
        'nc.list'
    ]);
});
