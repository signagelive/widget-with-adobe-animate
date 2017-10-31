define(['wdf/event-emitter', 'wdf/adobe-animate', 'app/views/stage-setup'], function(EventEmitter, AdobeAnimate) {
    function IndexView(config) {
        var self = this;
        var config = config;
        var adobeAnimate = null;
        var bindings = [];

        self.init = function() {

            adobeAnimate = new AdobeAnimate(config.animateCompositionId, config.stageName);

            adobeAnimate.on('adobe-animate-initialized', function(event, data) {
                console.log('Adobe Animate Initialized');

                self.trigger('view-initialized', null);
            });

            // init the animation
            adobeAnimate.init();
        }
    }

    IndexView.prototype = Object.create(EventEmitter.prototype);

    return IndexView;
})