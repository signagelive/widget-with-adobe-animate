define(['wdf/logger', 'wdf/event-emitter'], function(logger, EventEmitter) {
    function AdobeAnimateLoader(compositionId, stageName) {
        var self = this;

        // Adobe Animate generated variables
        var canvas, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
        // move this to global in the object so that we can dynamically create boards
        self.stageName = stageName;
        self.composition = null;
        self.stage = null;

        self.init = function() {
            logger.debug('AdobeAnimateLoader.init()');
            try {
                canvas = document.getElementById("canvas");
                anim_container = document.getElementById("animation_container");
                dom_overlay_container = document.getElementById("dom_overlay_container");
                self.composition = AdobeAn.getComposition(compositionId);

                var lib = self.composition.getLibrary();
                var loader = new createjs.LoadQueue(false);
                loader.addEventListener("fileload", function(evt) {
                    handleFileLoad(evt, self.composition)
                });
                loader.addEventListener("complete", function(evt) {
                    handleComplete(evt, self.composition)
                });
                var lib = self.composition.getLibrary();
                loader.loadManifest(lib.properties.manifest);
            } catch (e) {
                logger.error('Error initalizing AdobeAnimateLoader ' + e.message);
            }

        }

        function handleFileLoad(evt, comp) {
            var images = comp.getImages();
            if (evt && (evt.item.type == "image")) {
                images[evt.item.id] = evt.result;
            }
        }

        function handleComplete(evt, comp) {
            //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
            var lib = comp.getLibrary();
            var ss = comp.getSpriteSheet();
            var queue = evt.target;
            var ssMetadata = lib.ssMetadata;
            for (i = 0; i < ssMetadata.length; i++) {
                ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                    "images": [queue.getResult(ssMetadata[i].name)],
                    "frames": ssMetadata[i].frames
                })
            }
            exportRoot = new lib[self.stageName];
            self.stage = new lib.Stage(canvas);
            self.stage.addChild(exportRoot);
            self.stage.enableMouseOver();
            //Registers the "tick" event listener.
            fnStartAnimation = function() {
                    createjs.Ticker.setFPS(lib.properties.fps);
                    createjs.Ticker.addEventListener("tick", self.stage);
                }
                //Code to support hidpi screens and responsive scaling.
            function makeResponsive(isResp, respDim, isScale, scaleType) {
                var lastW, lastH, lastS = 1;
                window.addEventListener('resize', resizeCanvas);
                resizeCanvas();

                function resizeCanvas() {
                    var w = lib.properties.width,
                        h = lib.properties.height;
                    var iw = window.innerWidth,
                        ih = window.innerHeight;
                    var pRatio = window.devicePixelRatio || 1,
                        xRatio = iw / w,
                        yRatio = ih / h,
                        sRatio = 1;
                    if (isResp) {
                        if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
                            sRatio = lastS;
                        } else if (!isScale) {
                            if (iw < w || ih < h)
                                sRatio = Math.min(xRatio, yRatio);
                        } else if (scaleType == 1) {
                            sRatio = Math.min(xRatio, yRatio);
                        } else if (scaleType == 2) {
                            sRatio = Math.max(xRatio, yRatio);
                        }
                    }
                    canvas.width = w * pRatio * sRatio;
                    canvas.height = h * pRatio * sRatio;
                    canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
                    canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
                    self.stage.scaleX = pRatio * sRatio;
                    self.stage.scaleY = pRatio * sRatio;
                    lastW = iw;
                    lastH = ih;
                    lastS = sRatio;
                }
            }
            makeResponsive(true, 'both', false, 1);
            AdobeAn.compositionLoaded(lib.properties.id);
            fnStartAnimation();

            self.trigger('adobe-animate-initialized', null);
        }
    }

    AdobeAnimateLoader.prototype = Object.create(EventEmitter.prototype);
    return AdobeAnimateLoader;
})