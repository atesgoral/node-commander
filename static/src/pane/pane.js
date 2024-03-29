define([
    'angular',
    'nc',
    'text!./pane.html',
    'less!./pane'
], function (
    angular,
    nc,
    template
) {
    'use strict';

    return nc.directive('pane', function () {
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

                // @todo revise. may just need a list of urls
                $scope.tabs = pane.tabs.map(function (tab) {
                    return {
                        sourceUrl: tab.sourceUrl
                    };
                });

                $scope.getUrlDisplay = function (url) {
                    return url
                        ? url.split(/[\/\\]/).pop() || '/'
                        : '?';
                };

                $scope.switchToTab = function (tabIdx) {
                    $scope.activeTabIdx = tabIdx;
                };

                $scope.$on('switch-pane', function () {
                    $scope.focused = !$scope.focused;
                });

                var keyCodeMnemonicMap = {
                    8: 'BACKSPACE',
                    9: 'TAB',
                    13: 'ENTER',
                    32: 'SPACE',
                    33: 'PAGE_UP',
                    34: 'PAGE_DOWN',
                    35: 'END',
                    36: 'HOME',
                    38: 'ARROW_UP',
                    40: 'ARROW_DOWN',
                    112: 'F1',
                    113: 'F2',
                    114: 'F3',
                    115: 'F4',
                    116: 'F5',
                    117: 'F6',
                    118: 'F7',
                    119: 'F8',
                    120: 'F9',
                    121: 'F10',
                    122: 'F11',
                    123: 'F12'
                };

                var actionConfig = {
                    /* Cursor */
                    'cursor-up': 'ARROW_UP',
                    'cursor-down': 'ARROW_DOWN',
                    'cursor-page-up': 'PAGE_UP',
                    'cursor-page-down': 'PAGE_DOWN',
                    'cursor-first': 'HOME',
                    'cursor-last': 'END',
                    /* Selection */
                    'selection-toggle': 'SPACE',
                    /* Operations */
                    'operation-exec': 'ENTER',
                    'operation-dir-up': 'BACKSPACE',
                    'operation-copy': 'F5',
                    'operation-move': 'F6',
                    'operation-new-directory': 'F7'
                };

                var keyComboActionEventMap = {};

                for (var actionEvent in actionConfig) {
                    keyComboActionEventMap[actionConfig[actionEvent]] = actionEvent;
                }

                $element.on('keydown', function (evt) {
                    var keyMnemonic = keyCodeMnemonicMap[evt.which];

                    if (!keyMnemonic) {
                        // Unknown key, ignore
                        return;
                    }

                    var keyComboParts = [];

                    if (evt.shiftKey) {
                        keyComboParts.push('SHIFT');
                    }

                    if (evt.ctrlKey) {
                        keyComboParts.push('CTRL');
                    }

                    keyComboParts.push(keyMnemonic);

                    var keyCombo = keyComboParts.join('+');

                    var actionEvent = keyComboActionEventMap[keyCombo];

                    if (actionEvent) {
                        // @todo directly call methods on interfaces instead of messaging?
                        evt.preventDefault();
                        $scope.$broadcast(actionEvent);
                        return;
                    }

                    // @todo convert to action config
                    switch (evt.which) {
                    case 9: // Tab
                        // @todo perhaps no need to use tabindex + proper focus
                        if (paneIdx == 1) { // @todo better way to say "last tab"
                            $scope.restoreFocus();
                            evt.preventDefault();
                        }
                        break;
                    case 45: // Insert
                        $scope.$broadcast('selection-toggle');
                        $scope.$broadcast('cursor-down');
                        break;
                    case 56: // 8 (*)
                        if (!evt.shiftKey) {
                            break;
                        }
                        /* falls through */
                    case 106: // Num *
                        $scope.$broadcast('selection-invert');
                        break;
                    case 187: // = (+)
                        if (!evt.shiftKey) {
                            break;
                        }
                        /* falls through */
                    case 107: // Num +
                        $scope.$broadcast('selection-expand');
                        break;
                    case 189: // -
                    case 109: // Num -
                        $scope.$broadcast('selection-shrink');
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