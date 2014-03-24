define([
    'angular',
    'text!./pane.html'
], function (
    ng,
    template
) {
    'use strict';

    ng.module('nc.pane', []).directive('pane', [ '$q', function ($q) {
        return {
            restrict: 'E',
            template: template,
            replace: true,
            scope: true,

            controller: function ($scope, $element, $attrs) {
                //console.dir('hello from pane ' + $scope.panes[$attrs.name].name);
                var paneName = $scope.paneName = $attrs.name;

                $scope.activeTabIdx = 0;

                $scope.tabs = $scope.panes[paneName].tabs.map(function (tab) {
                    var source = $q.defer();

                    source.resolve(tab.files);

                    return {
                        display: tab.sourceUrl,
                        source: source.promise
                    };
                });

                $scope.switchToTab = function (tabIdx) {
                    $scope.activeTabIdx = tabIdx;
                };
            }
        };
    }]);
});