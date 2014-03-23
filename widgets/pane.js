define([
	'angular',
	'text!./pane.html'
], function (
	ng,
	template
) {
	'use strict';

	ng.module('nc.pane', []).directive('pane', function () {
		return {
			restrict: 'E',
			template: template,
			
			link: function (scope, element) {

			}
		};
	});
});