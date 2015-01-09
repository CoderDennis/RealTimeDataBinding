define(function () {
    ko.bindingHandlers.price = {
        update: function (element, valueAccessor) {
            var price = ko.unwrap(valueAccessor());
            $(element).text(price.toFixed(2));
        }
    }
});