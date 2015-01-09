define(function () {
    // A simple background color flash effect that uses jQuery Color plugin
    jQuery.fn.flash = function (color, duration) {
        var current = this.css('backgroundColor');
        this.animate({ backgroundColor: 'rgb(' + color + ')' }, duration / 2)
            .animate({ backgroundColor: current }, duration / 2);
    };

    ko.bindingHandlers.changeFlash = {
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            if (value) {
                var bg = value < 0
                            ? '255,148,148' // red
                            : '154,240,117'; // green
                $(element).flash(bg, 1000);
            }
        }
    }
});