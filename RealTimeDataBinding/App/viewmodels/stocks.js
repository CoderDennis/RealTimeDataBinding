/// <reference path="../../Scripts/jquery-2.1.2.js" />
/// <reference path="../../Scripts/jquery.signalR-2.1.2.js" />
/// <reference path="../../Scripts/require.js"/>
/// <reference path="../../Scripts/underscore.js"/>

define([], function () {
    var ticker = $.connection.stockTicker, // the generated client-side hub proxy
    up = '▲',
    down = '▼';
    //$stockTable = $('#stockTable'),
    //$stockTableBody = $stockTable.find('tbody'),
    //rowTemplate = '<tr data-symbol="{Symbol}"><td>{Symbol}</td><td>{Price}</td><td>{DayOpen}</td><td>{DayHigh}</td><td>{DayLow}</td><td><span class="dir {DirectionClass}">{Direction}</span> {Change}</td><td>{PercentChange}</td></tr>',
    //$stockTicker = $('#stockTicker'),
    //$stockTickerUl = $stockTicker.find('ul'),
    //liTemplate = '<li data-symbol="{Symbol}"><span class="symbol">{Symbol}</span> <span class="price">{Price}</span> <span class="change"><span class="dir {DirectionClass}">{Direction}</span> {Change} ({PercentChange})</span></li>';

    var vm = {
        stocks: [],
        isMarketOpened: false,
        openMarket: function() {
            ticker.server.openMarket();
        },
        closeMarket: function() {
            ticker.server.closeMarket();
        },
        reset: function() {
            ticker.server.reset();
        }
    };


    function init() {
        return ticker.server.getAllStocks().done(function (stocks) {
            vm.stocks = stocks;
        });
    };

    //function formatStock(stock) {
    //    return $.extend(stock, {
    //        Price: stock.Price.toFixed(2),
    //        PercentChange: (stock.PercentChange * 100).toFixed(2) + '%',
    //        Direction: stock.Change === 0 ? '' : stock.Change >= 0 ? up : down,
    //        DirectionClass: stock.Change === 0 ? 'even' : stock.Change >= 0 ? 'up' : 'down'
    //    });
    //}

    //function scrollTicker() {
    //    var w = $stockTickerUl.width();
    //    $stockTickerUl.css({ marginLeft: w });
    //    $stockTickerUl.animate({ marginLeft: -w }, 15000, 'linear', scrollTicker);
    //}

    //function stopTicker() {
    //    $stockTickerUl.stop();
    //}

    // Add client-side hub methods that the server will call
    $.extend(ticker.client, {
        updateStockPrice: function (stock) {
            _.chain(vm.stocks)
                .where({ Symbol: stock.Symbol })
                .each(function(stockToUpdate) {
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
        },

        marketOpened: function () {
            vm.isMarketOpened = true;
            //scrollTicker();
        },

        marketClosed: function () {
            vm.isMarketOpened = false;
            //stopTicker();
        },

        marketReset: function () {
            return init();
        }
    });


    vm.activate = function () {
        // Start the connection
        $.connection.hub.start()
            .then(init)
            .then(function () {
                return ticker.server.getMarketState();
            })
            .done(function (state) {
                if (state === 'Open') {
                    ticker.client.marketOpened();
                } else {
                    ticker.client.marketClosed();
                }
            });
    };
    
    return vm;
});