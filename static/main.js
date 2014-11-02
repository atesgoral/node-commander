require.config({
    paths: {
        'text': 'bower_components/requirejs-text/text',
        'less': 'bower_components/require-less/less',
        'lessc': 'bower_components/require-less/lessc',
        'normalize': 'bower_components/require-less/normalize',
        'angular': 'bower_components/angular/angular.min',
    },
    shim: {
        angular: {
            exports: 'angular'
        }
    },
    deps: [ 'bootstrap' ]
});
