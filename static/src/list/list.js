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
            // scope: {
            //     sourceUrl: '='
            // },

            link: function ($scope, $element) {
                $scope.isSelected = [];

                $scope.$watch('sourceUrl', function () {
                    // @todo use $scope.sourceUrl
                    var url = $scope.sourceUrl;
                    // always assuming file: for now

                    $http.get('/api/file/ls', { params: { dirPath: url } }).then(function (response) {
                        var data = response.data;

                        $scope.dirPath = data.dirPath;
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

                        $scope.cursorIdx = 0; // @todo set cursor to child dir if just moved up dir
                    }, function (response) {
                        if (response.status) {
                            // @todo improperly implemented
                            $scope.files[$scope.cursorIdx].isForbidden = true;
                        }
                    });
                });

                $scope.$on('move-cursor-by', function (evt, vector) {
                    if ($scope.files && $scope.files.length) {
                        var cursorIdx = $scope.cursorIdx + vector;

                        if (cursorIdx < 0) {
                            cursorIdx = 0;
                        } else if (cursorIdx >= $scope.files.length) {
                            cursorIdx = $scope.files.length - 1;
                        }

                        $scope.$apply(function () {
                            $scope.cursorIdx = cursorIdx;
                        });

                        // @todo scroll to cursor
                    }
                });

                $scope.$on('move-cursor-to', function (evt, where) {
                    if ($scope.files && $scope.files.length) {
                        var cursorIdx = {
                            first: 0,
                            last: $scope.files.length - 1
                        }[where];

                        if (!isNaN(cursorIdx)) {
                            $scope.$apply(function () {
                                $scope.cursorIdx = cursorIdx;
                            });
                        }

                        // @todo scroll to cursor
                    }
                });

                $scope.$on('toggle-selection', function (evt) {
                    if ($scope.files && $scope.files.length) {
                        $scope.$apply(function () {
                            $scope.isSelected[$scope.cursorIdx] = !$scope.isSelected[$scope.cursorIdx];
                        });
                    }
                });

                $scope.$on('invert-selection', function (evt) {
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

                $scope.$on('expand-selection', function (evt) {
                    modifySelection(true);
                });

                $scope.$on('shrink-selection', function (evt) {
                    modifySelection(false);
                });

                $scope.$on('exec', function (evt) {
                    // @todo if ($scope.files && $scope.files.length) {
                    var file = $scope.files[$scope.cursorIdx];

                    if (file.isDirectory) {
                        $scope.$apply(function () {
                            $scope.sourceUrl = file.path;
                        });
                    } else {
                        // @todo shell exec file
                    }
                });

                $scope.$on('dir-up', function (evt) {
                    // @todo if ($scope.files && $scope.files.length) {
                    var file = $scope.files[0];

                    if (file.name === '..') {
                        $scope.$apply(function () {
                            $scope.sourceUrl = file.path;
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
                            $scope.sourceUrl = file.path;
                        });
                    }
                });
            }
        };
    } ]);
});