define([
    'angular',
    'text!./list.html',
    'less!./list'
], function (
    angular,
    template
) {
    'use strict';

    angular.module('nc.list', []).directive('list', [ '$http', function ($http) {
        return {
            restrict: 'E',
            template: template,
            replace: true,
            // scope: {
            //     sourceUrl: '='
            // },

            link: function ($scope, $element) {
                $scope.cursorIdx = 0;
                $scope.isSelected = [];

                $scope.$watch('sourceUrl', function () {
                    console.log($scope.sourceUrl);
                    // @todo use $scope.sourceUrl
                    var url = $scope.sourceUrl;
                    // always assuming file: for now

                    $http.get('/api/file/ls', { params: { dirPath: url } }).then(function (response) {
                        var data = response.data;

                        $scope.dirPath = data.dirPath;
                        $scope.files = data.files;
                    });
                });

                $scope.$on('move-cursor', function (evt, vector) {
                    if ($scope.files && $scope.files.length) {
                        var cursorIdx = $scope.cursorIdx + vector;

                        if (cursorIdx < 0) {
                            cursorIdx = 0;
                        } else if (cursorIdx === $scope.files.length) {
                            cursorIdx = $scope.files.length - 1;
                        }

                        $scope.$apply(function () {
                            $scope.cursorIdx = cursorIdx;
                        });

                        // @todo scroll to cursor
                    }
                });

                $scope.$on('toggle-selection', function (evt) {
                    if ($scope.files && $scope.files.length) {
                        $scope.isSelected[$scope.cursorIdx] = !$scope.isSelected[$scope.cursorIdx];
                    }
                });

                $element.on('mousedown', function (evt) { // @todo selector?
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
                    var idx = angular.element(evt.target.parentNode).data().$scope.$index;

                    $scope.$apply(function () {
                        $scope.sourceUrl = $scope.files[idx].path;
                    });
                });
            }
        };
    } ]);
});