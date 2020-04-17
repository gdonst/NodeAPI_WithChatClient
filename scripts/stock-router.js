const stockController = require('./stockController.js');

/* Module for handling specific requests/routes for stock data */
// return just the requested stock
const handleSingleSymbol = (stocks, app) => {
    app.route('/stock/:symbol')
    // if it is a GET request then return specified stock
    .get( (req,resp) => {
        stockController.findSymbol(stocks,req,resp);
    })
    // if it is a PUT request then update specified stock
    .put( (req,resp) => {
        stockController.updateSymbol(stocks,req,resp);
    })
    // if it is a POST request then insert new stock
    .post( (req,resp) => {
        stockController.insertSymbol(stocks,req,resp);
    })
    // if it is a DELETE request then delete specified stock
    .delete( (req,resp) => {
        stockController.deleteSymbol(stocks,req,resp);
    }); 
};
// return all the stocks whose name contains the supplied text
const handleNameSearch = (stocks, app) => {
    app.get('/stock/name/:substring', (req,resp) => {
        stockController.findName(stocks,req,resp);
    });
};

// return daily price data
const handlePriceData = (stocks, app) => {
    app.get('/stock/hourly/:symbol', (req,resp) => {
        stockController.findPrices(stocks,req,resp);
    });
}

module.exports = {
 handleSingleSymbol,
 handleNameSearch,
 handlePriceData
};