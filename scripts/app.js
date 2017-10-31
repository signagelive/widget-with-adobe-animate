require.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app',
        jquery: 'vendor/jquery'
    },
    shim: {
        'vendor/createjs': {
            exports: '/vendor/createjs'
        },
        'wdf/adobe-animate': {
            deps: ['vendor/createjs'],
            exports: 'wdf/adobe-animate'
        },
        'app/views/stage-setup': {
            deps: ['wdf/adobe-animate'],
            exports: 'app/views/stage-setup'
        }
    }
});

require(['jquery', 'wdf/widget-config', 'app/views/index'], function($, WidgetConfig, IndexView) {

    // load the widget configuration
    var config = new WidgetConfig();
    config.on('config-initialized', function(event, data) {
        // wrapper around the Adobe Animate UI
        var view = new IndexView({
            stageName: 'ENTER STAGE NAME HERE',
            animateCompositionId: 'ENTER ANIMATE COMPOSITION ID HERE'
        });
        view.on('view-initialized', function(event, data) {

        });
        view.init();
    });


    config.on('config-error', function() {
        console.log('Error loading preferences');
    });
    config.init();
});