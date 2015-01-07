define(function () {
    var ticker;

    return {
        connect: function(updateStockPrice, marketOpened, marketClosed, marketReset) {
            ticker = $.connection.stockTicker; // the generated client-side hub proxy
            ticker.client.updateStockPrice = updateStockPrice;
            ticker.client.marketOpened = marketOpened;
            ticker.client.marketClosed = marketClosed;
            ticker.client.marketReset = marketReset;
            return $.connection.hub.start();
        },
        disconnect: function () {
            return $.connection.hub.stop();
        },
        openMarket: function() {
            ticker.server.openMarket();
        },
        closeMarket: function() {
            ticker.server.closeMarket();
        },
        reset: function() {
            ticker.server.reset();
        },
        getAllStocks: function() {
            return ticker.server.getAllStocks();
        },
        getMarketState: function() {
            return ticker.server.getMarketState();
        }
    };
});