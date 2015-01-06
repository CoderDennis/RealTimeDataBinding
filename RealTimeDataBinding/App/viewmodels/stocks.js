/// <reference path="../../Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="../../Scripts/underscore.js"/>
/// <reference path="../../Scripts/require.js"/>

define(['stocks-hub'], function (stocksHub) {

    var vm = {
        stocks: [],
        isMarketOpened: false,
        openMarket: stocksHub.openMarket,
        closeMarket: stocksHub.closeMarket,
        reset: stocksHub.reset
    };

    function formatStock(stock) {
        return $.extend(stock, {
            Price: stock.Price.toFixed(2),
            PercentChange: (stock.PercentChange * 100).toFixed(2) + '%',
            DirectionClass: stock.Change === 0 ? '' : stock.Change >= 0 ? 'fa-caret-up' : 'fa-caret-down'
        });
    }

    function init() {
        stocksHub.getAllStocks().done(function (stocks) {
            vm.stocks = _.map(stocks, formatStock);
        });
    };

    function scrollTicker() {
        var $stockTickerUl = $('#stockTicker').find('ul');
        var w = $stockTickerUl.width();
        $stockTickerUl.css({ marginLeft: w });
        $stockTickerUl.animate({ marginLeft: -w }, 15000, 'linear', scrollTicker);
    }

    function stopTicker() {
        $('#stockTicker').find('ul').stop();
    }

    function updateStockPrice(stock) {
        stock = formatStock(stock);
        _.chain(vm.stocks)
            .where({ Symbol: stock.Symbol })
            .each(function (stockToUpdate) {
                for (var prop in stock) {
                    if (stock.hasOwnProperty(prop)) {
                        stockToUpdate[prop] = stock[prop];
                    }
                }
            });
        //var displayStock = formatStock(stock),
        //    $row = $(rowTemplate.supplant(displayStock)),
        //    $li = $(liTemplate.supplant(displayStock)),
        //    bg = stock.LastChange < 0
        //            ? '255,148,148' // red
        //            : '154,240,117'; // green

        //$stockTableBody.find('tr[data-symbol=' + stock.Symbol + ']')
        //    .replaceWith($row);
        //$stockTickerUl.find('li[data-symbol=' + stock.Symbol + ']')
        //    .replaceWith($li);

        //$row.flash(bg, 1000);
        //$li.flash(bg, 1000);
    }

    function marketOpened() {
        vm.isMarketOpened = true;
        scrollTicker();
    }

    function marketClosed() {
        vm.isMarketOpened = false;
        stopTicker();
    }

    vm.activate = function () {
        // Start the connection
        stocksHub.connect(updateStockPrice, marketOpened, marketClosed, init)
            .then(init)
            .then(function () {
                return stocksHub.getMarketState();
            })
            .done(function (state) {
                if (state === 'Open') {
                    marketOpened();
                } else {
                    marketClosed();
                }
            });
    };
    
    return vm;
});