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

                // now the Adobe Animate stage is initialized set the references to the actual controls that are databound
                for (var i = 0; i < bindings.length; i++) {
                    var binding = bindings[i];
                    binding.control = adobeAnimate.stage.children[0][binding.controlName];
                }

                self.trigger('view-initialized', null);
            });

            // setup the databinding
            setupDataBinding();

            // init the animation
            adobeAnimate.init();
        }

        self.update = function(data) {
            for (var i = 0; i < bindings.length; i++) {
                var binding = bindings[i];

                // find the bound data item
                var matchedItem = data.find(function(item) {
                    return (item[binding.dataIdProperty] == binding.dataValue)
                });

                if (matchedItem != null) {
                    var value = matchedItem[binding.dataDisplayProperty];

                    if (binding.formatter != null)
                        value = binding.formatter(value, binding.formatString);

                    binding.control[binding.controlProperty] = value;
                }
            }
        }

        function setupDataBinding() {
            // TODO configure the array of data bindings here - it is an array of objects per the example below
            /*
            {
            control: null,
            controlName: 'THE NAME OF THE CONTROL TO BIND',
            controlProperty: 'THE NAME OF THE CONTROL PROPERTY TO UPDATE',
            dataIdProperty: 'THE ID PROPERTY OF THE DATA OBJECT',
            dataDisplayProperty: 'THE PROPERTY OF THE DATA OBJECT TO BIND TO THE CONTROL',
            dataValue: 'THE VALUE OF THE ID FIELD OF THE DATA OBJECT TO BE BOUND TO THE CONTROL'
            }

            e.g.
            var binding = {
            control: null,
            controlName: 'product1Price',
            controlProperty: 'text',
            dataIdProperty: 'id',
            dataDisplayProperty: 'price',
            dataValue: '735'
            };

            bindings.push(binding);
            */
        }
    }

    IndexView.prototype = Object.create(EventEmitter.prototype);

    return IndexView;
})