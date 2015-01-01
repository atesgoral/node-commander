define([
    'angular',
    'nc',
    'text!./list.html',
    'less!./list'
], function (
    angular,
    nc,
    template
) {
    'use strict';

    return nc.directive('list', [ '$http', '$window', function ($http, $window) {
        return {
            restrict: 'E',
            template: template,
            replace: true,
            require: '?ngModel',

            link: function ($scope, $element, $attrs, ngModel) {
                $scope.isSelected = [];

                // @todo always assuming file:// for now
                function setUrl(url) {
                    $http.get('/api/file/ls', { params: { dirPath: url } }).then(function (response) {
                        var data = response.data;

                        ngModel.$setViewValue(data.dirPath);

                        $scope.files = data.files.sort(function (a, b) {
                            return b.isDirectory - a.isDirectory
                                || a.name.localeCompare(b.name)
                                || a.ext.localeCompare(b.ext);
                            // @todo add sorting by columns after directory check
                        });

                        if (data.parentPath) {
                            $scope.files.unshift({
                                path: data.parentPath,
                                name: '..',
                                isDirectory: true
                            });
                        }

                        cursor.setPos(0); // @todo set cursor to child dir if just moved up dir
                    }, function (response) {
                        if (response.status) {
                            // @todo improperly implemented
                            $scope.files[$scope.cursorIdx].isForbidden = true;
                        }
                    });
                }

                ngModel.$render = function () {
                    setUrl(ngModel.$viewValue);
                };

                var cursor = (function (list) {
                    var pos = 0;

                    function moveTo(newPos) {
                        pos = newPos;
                    }

                    function moveBy(amount) {
                        var newPos = pos + amount,
                            itemCount = list.getItemCount();

                        if (newPos < 0) {
                            newPos = 0;
                        } else if (newPos >= itemCount) {
                            newPos = itemCount - 1;
                        }

                        moveTo(newPos);
                    }

                    return {
                        setPos: function (newPos) {
                            pos = newPos;
                        },
                        getPos: function () {
                            return pos;
                        },
                        up: function () {
                            moveBy(-1);
                        },
                        down: function () {
                            moveBy(1);
                        },
                        pageUp: function () {
                            // @todo determine actual page size from viewport
                            moveBy(-10);
                        },
                        pageDown: function () {
                            moveBy(10);
                        },
                        first: function () {
                            moveTo(0);
                        },
                        last: function () {
                            moveTo(list.getItemCount() - 1);
                        }
                    };
                })({
                    getItemCount: function () {
                        return $scope.files.length;
                    }
                });

                var selection = (function () {
                    var isSelected = [];

                    return {

                    };
                })();

                var eventHandlerMap = {
                    'cursor-up': cursor.up,
                    'cursor-down': cursor.down,
                    'cursor-page-up': cursor.pageUp,
                    'cursor-page-down': cursor.pageDown,
                    'cursor-first': cursor.first,
                    'cursor-last': cursor.last
                };

                angular.forEach(eventHandlerMap, function (eventHandler, eventName) {
                    $scope.$on(eventName, function () {
                        eventHandler();
                        // @todo scroll to cursor
                        $scope.$digest();
                    });
                });

                $scope.getCursorPos = function () {
                    return cursor.getPos();
                };

                $scope.$on('selection-toggle', function (evt) {
                    // @todo if dir, calculate dir size
                    if ($scope.files && $scope.files.length) {
                        $scope.$apply(function () {
                            $scope.isSelected[$scope.cursorIdx] = !$scope.isSelected[$scope.cursorIdx];
                        });
                    }
                });

                $scope.$on('selection-invert', function (evt) {
                    if ($scope.files && $scope.files.length) {
                        $scope.$apply(function () {
                            $scope.files.forEach(function (file, idx) {
                                $scope.isSelected[idx] = !$scope.isSelected[idx];
                            });
                        });
                    }
                });

                function modifySelection(expand) {
                    if ($scope.files && $scope.files.length) {
                        var pattern = $window.prompt((expand ? 'Expand' : 'Shrink') + ' selection using pattern:', '*.*');

                        if (pattern) {
                            var re = new RegExp(
                                pattern
                                    .replace(/\./g, '\\.')
                                    .replace(/\+/g, '\\+')
                                    .replace(/\{/g, '\\{')
                                    .replace(/\(/g, '\\(') // @todo check if there are any other special characters that need escaping
                                    .replace(/\?/g, '.')
                                    .replace(/\*/g, '.*?')
                            );

                            $scope.$apply(function () {
                                $scope.files.forEach(function (file, idx) {
                                    if (re.test(file.filename)) {
                                        $scope.isSelected[idx] = expand;
                                    }
                                });
                            });
                        }
                    }
                }

                $scope.$on('selection-expand', function (evt) {
                    modifySelection(true);
                });

                $scope.$on('selection-shrink', function (evt) {
                    modifySelection(false);
                });

                $scope.$on('operation-exec', function (evt) {
                    // @todo if ($scope.files && $scope.files.length) {
                    var file = $scope.files[$scope.cursorIdx];

                    if (file.isDirectory) {
                        $scope.$apply(function () {
                            setUrl(file.path);
                        });
                    } else {
                        // @todo shell exec file
                    }
                });

                $scope.$on('operation-dir-up', function (evt) {
                    // @todo if ($scope.files && $scope.files.length) {
                    var file = $scope.files[0];

                    if (file.name === '..') {
                        $scope.$apply(function () {
                            setUrl(file.path);
                        });
                    }
                });

                $element.on('mousedown', function (evt) { // @todo selector?
                    // @todo if ($scope.files && $scope.files.length) {
                    if (evt.target.tagName === 'TD') {
                        $scope.$apply(function () {
                            var idx = angular.element(evt.target.parentNode).data().$scope.$index;

                            if (evt.shiftKey) {
                                var start = Math.min($scope.cursorIdx, idx),
                                    end = Math.max($scope.cursorIdx, idx);

                                $scope.isSelected = [];

                                for (var i = start; i <= end; i++) {
                                    $scope.isSelected[i] = true;
                                }

                                evt.preventDefault();
                            } else if (evt.ctrlKey) {
                                $scope.isSelected[idx] = !$scope.isSelected[idx];
                            }

                            $scope.cursorIdx = idx;
                        });
                    }
                });

                $element.on('dblclick', function (evt) {
                    // @todo if ($scope.files && $scope.files.length) {
                    var idx = angular.element(evt.target.parentNode).data().$scope.$index,
                        file = $scope.files[idx];

                    if (file.isDirectory) {
                        $scope.$apply(function () {
                            setUrl(file.path);
                        });
                    }
                });
            }
        };
    } ]);
});