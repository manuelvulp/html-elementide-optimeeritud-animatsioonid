define(function (require) {

    require('gsap');
    var _ = require('underscore');
    var $ = require('jquery');
    var move = require('move');

    var windowHeight = $(window).height();
    windowHeight = 500;
    var windowWidth = $(window).width();
    windowWidth = 350;

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
    var controlElements = gui.add(controls, 'elements', [1, 100, 500, 1000, 2000, 5000]);
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
        renderHtml();
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

    function resetHtml() {
        _.forEach(elements, function (element) {
            element.stopAnimating = true;
            element.remove();
            delete element;
        });
        elements.length = 0;
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
        return _.random(0, windowWidth);
    }

    function getRandomHeight() {
        return _.random(0, windowHeight);
    }

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
                .ease('linear')
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
});