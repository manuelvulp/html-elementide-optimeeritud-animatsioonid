requirejs.config({
    baseUrl: './',

    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore',

        gsap: 'bower_components/gsap/src/uncompressed/TweenMax',
        move: 'bower_components/move.js/move'
    }
});

requirejs(['app/main']);