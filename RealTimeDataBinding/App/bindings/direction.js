define(function () {
    ko.bindingHandlers.direction = {
        init: function(element) {
            $(element).addClass('fa fa-lg');
        },
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).removeClass('fa-caret-up fa-caret-down');
            $(element).addClass(value === 0 ? '' : value >= 0 ? 'fa-caret-up' : 'fa-caret-down');
        }
    }
});