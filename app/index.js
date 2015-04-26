requirejs.config({
    baseUrl: './',

    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore',

        gsap: 'bower_components/gsap/src/uncompressed/TweenMax',
        pixi: 'bower_components/pixi.js/bin/pixi',
        move: 'bower_components/move.js/move'
    }
});

requirejs(['app/main']);