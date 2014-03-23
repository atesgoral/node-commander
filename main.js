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
        // var paneSourceChange = {
        //     left: $q.defer(),
        //     right: $q.defer()
        // };

        // $rootScope.paneSourceChange = {
        //     left: paneSourceChange.left.promise,
        //     right: paneSourceChange.right.promise
        // };

        // var source = $q.defer();

        // paneSourceChange.left.notify(source.promise);

        // source.resolve([{
        //     name: "doge",
        //     ext: "jpg",
        //     size: "43210",
        //     date: new Date()
        // }, {
        //     name: "nyan",
        //     ext: "gif",
        //     size: "65535",
        //     date: new Date()
        // }]);

        // panel name
        $rootScope.panes = {
            left: {
                name: 'left',
                tabs: [{
                    source: 'file://foo'
                }, {
                    source: 'file://bar'
                }]
            },
            right: {
                name: 'right',
                tabs: [{
                    source: 'file://baz'
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
