define([
    'angular',
    'text!./list.html'
], function (
    ng,
    template
) {
    'use strict';

    ng.module('nc.list', []).directive('list', function () {
        return {
            restrict: 'E',
            template: template,
            replace: true,
            scope: {
                source: '='
            },

            link: function ($scope, $element) {
                $scope.cursorIdx = 0;

                $scope.$watch('source', function () {
                    $scope.source.then(function (files) {
                        $scope.files = files;
                    }, function () {

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

                        $scope.cursorIdx = cursorIdx;
                    }
                });
            }
        };
    });
});