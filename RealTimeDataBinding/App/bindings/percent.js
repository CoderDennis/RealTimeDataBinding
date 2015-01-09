define(function () {
    ko.bindingHandlers.percent = {
        update: function (element, valueAccessor) {
            var value = ko.unwrap(valueAccessor());
            $(element).text((value * 100).toFixed(2) + '%');
        }
    }
});