define([
    'angular',
    'text!./pane.html'
], function (
    ng,
    template
) {
    'use strict';

    ng.module('nc.pane', []).directive('pane', function () {
        return {
            restrict: 'E',
            template: template,
            scope: true,

            controller: function ($scope, $element, $attrs) {
                //console.dir('hello from pane ' + $scope.panes[$attrs.name].name);
                var paneName = $scope.paneName = $attrs.name;

                $scope.tabs = $scope.panes[paneName].tabs.map(function (tab) {
                    return {
                        display: tab.source
                    };
                });
            }

            // link: function (scope, element, attrs) {
            //     scope.paneSourceChange[attrs.side].then(function () {}, function () {}, function (source) {
            //         console.log('source changed');
            //         source.then(function (files) {
            //             scope.files = files;
            //         });
            //     });
            // }
        };
    });
});