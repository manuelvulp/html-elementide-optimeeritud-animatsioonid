define(function (require) {

    require('gsap');
    var _ = require('underscore');
    var $ = require('jquery');
    var move = require('move');
    var PIXI = require('pixi');

    var stage = new PIXI.Stage(0xFFFFFF);
    var renderer = PIXI.autoDetectRenderer(1920, 1024, {
        transparent: true
    });
    var graphics = new PIXI.Graphics();
    document.body.appendChild(renderer.view);

    var $body = $('body');
    var $content = $('#content');
    var gui = new dat.GUI({
        autoPlace: false
    });
    var customContainer = document.getElementById('gui');
    customContainer.appendChild(gui.domElement);
    var elements = window.elements = [];

    var settings = {
        type: window.location.hash ? window.location.hash.replace('#', '') : 'JavaScript',
        elements: 100
    };

    var Controls = function() {
        this.type = settings.type;
        this.elements = settings.elements;
        this.boxShadow = false;
        this.borderRadius = false;
        this.translateZ = false;

        this.reset = renderScene;
        this.animate = animate;
    };

    var controls = new Controls();
    var controlType = gui.add(controls, 'type', ['JavaScript', 'Move.js', 'jQuery', 'GSAP', 'Pixi.js']);
    var controlElements = gui.add(controls, 'elements', [100, 500, 1000, 2000, 5000]);
    var controlBoxShadow = gui.add(controls, 'boxShadow');
    var controlBorderRadius = gui.add(controls, 'borderRadius');
    var controlTranslateZ = gui.add(controls, 'translateZ');
    gui.add(controls, 'reset');
    gui.add(controls, 'animate');

    controlType.onFinishChange(function (value) {
        settings.type = value;
        window.location.href = '#' + value;
        renderScene();
    });

    controlElements.onFinishChange(function (value) {
        settings.elements = value;
        renderScene();
    });

    controlBoxShadow.onFinishChange(function (value) {
        value ? $body.addClass('box-shadow') : $body.removeClass('box-shadow');
    });

    controlBorderRadius.onFinishChange(function (value) {
        value ? $body.addClass('border-radius') : $body.removeClass('border-radius');
    });

    controlTranslateZ.onFinishChange(function (value) {
        value ? $body.addClass('translate-z') : $body.removeClass('translate-z');
    });

    function renderScene() {
        resetHtml();
        resetCanvas();

        switch (settings.type) {
            case 'Pixi.js':
                renderCanvas();
                break;
            default:
                renderHtml();
                break;
        }
    }

    function renderHtml() {
        var elementsDiv = document.createElement('div');
        elementsDiv.className = 'boxes-wrapper';
        _.times(settings.elements, function () {
            var box = createBox();
            elementsDiv.appendChild(box);
            elements.push(box);
        });
        $content.html($(elementsDiv));
    }

    function renderCanvas() {
        _.times(settings.elements, function () {
            graphics.beginFill(0xFFCC00);
            graphics.drawRect(getRandomWidth(), getRandomHeight(), 50, 50);
            stage.addChild(graphics);
        });
        renderer.render(stage);
    }

    function resetHtml() {
        //console.log('[INFO] reset HTML');
        _.forEach(elements, function (element) {
            element.stopAnimating = true;
            element.remove();
            delete element;
        });
        elements.length = 0;
    }

    function resetCanvas() {
        graphics.clear();
        renderer.render(stage);
        console.log('[INFO] reset canvas');
    }

    function animate() {
        switch (settings.type) {
            case 'JavaScript':
                animateWithJavaScript();
                break;
            case 'Move.js':
                animateWithMoveJs();
                break;
            case 'jQuery':
                animateWithJQuery();
                break;
            case 'GSAP':
                animateWithGsap();
                break;
            case 'Pixi.js':
                break;
        }
    }

    function createBox() {
        var box = document.createElement('div');
        box.className = 'box';
        box.style.backgroundColor = getRandom();
        box.style.top = getRandomHeight().toString() + 'px';
        box.style.left = getRandomWidth().toString() + 'px';
        return box;
    }

    function getRandom() {
        return 'rgb(' + _.random(0, 255) + ', ' + _.random(0, 255) + ', ' + _.random(0, 255) + ')';
    }

    function getRandomWidth() {
        return _.random(0, 1920);
    }

    function getRandomHeight() {
        return _.random(0, 1024);
    }

    //var region = new Marionette.Region({
    //    el: '#content'
    //});

    renderScene();

    function animateWithJavaScript() {
        var animateBox = function (box) {
            box.steps = 0;
            var atTop = parseStringToInt(box.style.top);
            var atLeft = parseStringToInt(box.style.left);
            var stepTop = getNewTargetTop(box) / 3 / 60;
            var stepLeft = getNewTargetLeft(box) / 3 / 60;
            animateToTarget(box, atTop, atLeft, stepTop, stepLeft);
        };

        function animateToTarget(box, atTop, atLeft, stepTop, stepLeft) {
            box.style.top = atTop + 'px';
            box.style.left = atLeft + 'px';
            atTop += stepTop;
            atLeft += stepLeft;
            box.steps += 1;
            setTimeout(function () {
                if (box.stopAnimating) {
                    return false;
                } else if (box.steps === 180) {
                    animateBox(box);
                } else {
                    animateToTarget(box, atTop, atLeft, stepTop, stepLeft);
                }
            }, 1000 / 60);
        }

        _.forEach(elements, animateBox);
    }

    function animateWithJQuery() {
        var animateBox = function (box) {
            $(box).animate({
                left: getRandomWidth(),
                top: getRandomHeight()
            }, 3000, function () {
                if (!box.stopAnimating) {
                    animateBox(box);
                }
            });
        };
        _.forEach(elements, animateBox);
    }

    function animateWithMoveJs() {
        var animateBox = function (box) {
            move(box)
                .duration(3000)
                .add('left', getNewTargetLeft(box))
                .add('top', getNewTargetTop(box))
                .end(function () {
                    _.delay(function () {
                        animateBox(box);
                    }, 50);
                });
        };

        _.forEach(elements, animateBox);
    }

    function animateWithGsap() {
        var animateBox = function (box) {
            box.tween = TweenMax.to(box, 3, {
                ease: Linear.easeNone,
                left: getRandomWidth(),
                top: getRandomHeight(),
                onComplete: function () {
                    if (!box.stopAnimating) {
                        animateBox(box);
                    } else {
                        box.tween.kill();
                    }
                }
            });
        };

        _.forEach(elements, animateBox);
    }

    function getNewTargetTop(box) {
        return getRandomHeight() - parseStringToInt(box.style.top);
    }

    function getNewTargetLeft(box) {
        return getRandomWidth() - parseStringToInt(box.style.left);
    }

    function parseStringToInt(value) {
        return parseInt(value.split('px')[0], 10);
    }

    //function componentToHex(c) {
    //    var hex = c.toString(16);
    //    return hex.length == 1 ? "0" + hex : hex;
    //}
    //
    //function rgbToHex(r, g, b) {
    //    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    //}
});