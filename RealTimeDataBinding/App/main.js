﻿requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

// A simple background color flash effect that uses jQuery Color plugin
jQuery.fn.flash = function (color, duration) {
    var current = this.css('backgroundColor');
    this.animate({ backgroundColor: 'rgb(' + color + ')' }, duration / 2)
        .animate({ backgroundColor: current }, duration / 2);
};

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'],  function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    require([
        'bindings/direction',
        'bindings/percent',
        'bindings/price'
    ]);

    app.title = 'Durandal Starter Kit';

    app.configurePlugins({
        router: true,
        dialog: true,
        observable: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});