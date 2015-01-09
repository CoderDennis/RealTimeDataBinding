/// <reference path="../../Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="../../Scripts/underscore.js"/>
/// <reference path="../../Scripts/require.js"/>

define(['signalr/stocksHub'], function (stocksHub) {

    var vm = {
        stocks: [],
        isMarketOpened: false,
        openMarket: stocksHub.openMarket,
        closeMarket: stocksHub.closeMarket,
        reset: stocksHub.reset,
        deactivate: stocksHub.disconnect
    };

    function init() {
        stocksHub.getAllStocks().done(function (stocks) {
            vm.stocks = stocks;
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