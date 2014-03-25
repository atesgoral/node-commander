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

fs = requireNode('fs-plus');
path = requireNode('path');

require([
    'angular',
    'less',
    'widgets/pane',
    'widgets/list'
], function (ng) {
    'use strict';

    ng.module('nc.app', []).run([ '$rootScope', '$q', function ($rootScope, $q) {
        $rootScope.panes = [{
            tabs: [{
                sourceUrl: fs.getHomeDirectory(),
                files: fs.listSync(fs.getHomeDirectory())
                          .map(function(pathname) {
                            var ext = path.extname(pathname);
                            var name = path.basename(pathname, ext);
                            var stats = fs.statSync(pathname);

                            return {
                                name: name,
                                ext: ext,
                                size: stats.size,
                                date: stats.mtime
                            };
                          })
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

        ng.element(window).on('focus', function (evt) {
            $rootScope.restoreFocus();
        });
    }]);

    ng.bootstrap(document, [
        'nc.app',
        'nc.pane',
        'nc.list'
    ]);
});
