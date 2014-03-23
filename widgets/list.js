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

            link: function (scope, element) {

            }
        };
    });
});