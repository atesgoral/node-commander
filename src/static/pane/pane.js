define([
    'angular',
    'text!./pane.html',
    'less!./pane'
], function (
    angular,
    template
) {
    'use strict';

    angular.module('nc.pane', []).directive('pane', [ '$q', function ($q) {
        return {
            restrict: 'E',
            template: template,
            replace: true,
            scope: true,

            controller: function ($scope, $element, $attrs) {
                var paneIdx = $scope.idx = $attrs.idx;
                var pane = $scope.panes[paneIdx];

                pane.$element = $element;

                $scope.activeTabIdx = 0;

                $scope.tabs = pane.tabs.map(function (tab) {
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

                $scope.$on('switch-pane', function () {
                    console.log('switching');
                    $scope.focused = !$scope.focused;
                });

                $element.on('keydown', function (evt) {
                    switch (evt.which) {
                    case 9: // Tab
                        if (paneIdx == 1) { // @todo better way to say "last tab"
                            $scope.restoreFocus();
                            evt.preventDefault();
                        }
                        break;
                    case 38: // Arrow up
                        $scope.$broadcast('move-cursor', -1);
                        break;
                    case 40: // Arrow down
                        $scope.$broadcast('move-cursor', 1);
                        break;
                    }
                });

                $element.on('focus', function (evt) {
                    //$scope.focused = true;
                });

                $element.on('blur', function (evt) {
                    //$scope.focused = false;
                    // if (paneIdx == 1) { // @todo better way to say "last tab"
                    //     $scope.restoreFocus();
                    // }
                });
            }
        };
    }]);
});