define([
    'angular',
    'text!./pane.html',
    'less!./pane'
], function (
    angular,
    template
) {
    'use strict';

    angular.module('nc.pane', []).directive('pane', function () {
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
                    return {
                        display: '?', /*tab.sourceUrl.split(/[\/\\]/).pop(),*/
                        sourceUrl: tab.sourceUrl
                    };
                });

                $scope.switchToTab = function (tabIdx) {
                    $scope.activeTabIdx = tabIdx;
                };

                $scope.$on('switch-pane', function () {
                    $scope.focused = !$scope.focused;
                });

                $element.on('keydown', function (evt) {
                    switch (evt.which) {
                    case 8: // Backspace
                        $scope.$broadcast('dir-up');
                        evt.preventDefault();
                        break;
                    case 9: // Tab
                        // @todo perhaps no need to use tabindex + proper focus
                        if (paneIdx == 1) { // @todo better way to say "last tab"
                            $scope.restoreFocus();
                            evt.preventDefault();
                        }
                        break;
                    case 13: // Enter
                        $scope.$broadcast('exec');
                        break;
                    case 32: // Space
                        $scope.$broadcast('toggle-selection');
                        // @todo compute directory size
                        break;
                    case 38: // Arrow up
                        $scope.$broadcast('move-cursor-by', -1);
                        break;
                    case 40: // Arrow down
                        $scope.$broadcast('move-cursor-by', 1);
                        break;
                    case 33: // Page Up
                        $scope.$broadcast('move-cursor-by', -10); // @todo determine page size
                        break;
                    case 34: // Page Down
                        $scope.$broadcast('move-cursor-by', 10); // @todo determine page size
                        break;
                    case 36: // Home
                        $scope.$broadcast('move-cursor-to', 'first');
                        break;
                    case 35: // End
                        $scope.$broadcast('move-cursor-to', 'last');
                        break;
                    case 45: // Insert
                        $scope.$broadcast('toggle-selection');
                        $scope.$broadcast('move-cursor-by', 1);
                        break;
                    case 56: // 8 (*)
                        if (!evt.shiftKey) {
                            break;
                        }
                        /* falls through */
                    case 106: // Num *
                        $scope.$broadcast('invert-selection');
                        break;
                    case 187: // = (+)
                        if (!evt.shiftKey) {
                            break;
                        }
                        /* falls through */
                    case 107: // Num +
                        $scope.$broadcast('expand-selection');
                        break;
                    case 189: // -
                    case 109: // Num -
                        $scope.$broadcast('shrink-selection');
                        break;
                    case 191: // /
                    case 109: // Num /
                        // @todo restore previous selection
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
    });
});