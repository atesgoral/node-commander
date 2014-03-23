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
            scope: {
                files: '='
            },

            link: function (scope, element) {
                scope.cursorIdx = 0;
                // scope.source.then(function (files) {
                //     scope.files = files;
                // });
            }
        };
    });
});