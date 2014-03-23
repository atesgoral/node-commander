require.config({
	paths: {
		text: 'bower_components/requirejs-text/text',
		angular: 'bower_components/angular/angular.min',
		less: 'bower_components/less/dist/less-1.7.0.min'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		less: {
			exports: 'less'
		}
	}
});

require([
	'angular',
	'less',
	'widgets/pane',
	'widgets/list'
], function (ng) {
	'use strict';

	ng.bootstrap(document, [
		'nc.pane',
		'nc.list'
	]);
});
