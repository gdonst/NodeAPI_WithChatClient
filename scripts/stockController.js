// node at this point doesn't support native JS fetch
const fetch = require('node-fetch');
const _ = require('lodash');

// error messages need to be returned in JSON format
const jsonMessage = (msg) => {
    return { message : msg };
};

async function retrievePriceData(symbol, resp) {
    const url = `http://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=${symbol}`;
    // retrieve the response then the json
    const response = await fetch(url);
    const prices = await response.json();
    // return the retrieved price data
    resp.json(prices);
}

const findSymbol = (stocks, req, resp) => {
    // change user supplied symbol to upper case
    const symbolToFind = req.params.symbol.toUpperCase();
    // search the array of objects for a match
    const stock = stocks.filter(obj => symbolToFind === obj.symbol);
    // return the matching stock
    if (stock.length > 0) {
        resp.json(stock);
    } 
    else {
        resp.json(jsonMessage(`Symbol ${symbolToFind} not found`));
    }
};
const updateSymbol = (stocks, req, resp) => {
    const symbolToUpd = req.params.symbol.toUpperCase();
    // use lodash to find index for stock with this symbol
    let indx = _.findIndex(stocks, ['symbol', symbolToUpd]);
    // if didn't find it, then return message
    if (indx < 0) {
        resp.json(jsonMessage(`${symbolToUpd} not found`));
    }
    else {
        // symbol found, so replace its value with form values
        stocks[indx] = req.body;
        // let requestor know it worked
        resp.json(jsonMessage(`${symbolToUpd} updated`));
    }
};
const findName = (stocks, req, resp) => {
     // change user supplied substring to lower case
     const substring = req.params.substring.toLowerCase();
     // search the array of objects for a match
     const matches = stocks.filter( (obj) => obj.name.toLowerCase().includes(substring) );
     // return the matching stocks
     if (matches.length > 0) {
         resp.json(matches);
     } 
     else {
         resp.json(jsonMessage(`No symbol matches found for ${substring}`));
     }
};
const findPrices = (stocks, req, resp) => {
    // change user supplied symbol to upper case
    const symbolToFind = req.params.symbol.toUpperCase();
    // search the array of objects for a match
    const stock = stocks.filter(obj => symbolToFind === obj.symbol);
    // now get the daily price data
    if (stock.length > 0) {
        // now get the hourly price data from IEX
        retrievePriceData(symbolToFind, resp);
    }
    else {
        resp.json(jsonMessage(`Symbol ${symbolToFind} not found`));
    }
};
const insertSymbol = (stocks, req, resp) => {
    const symbolToAdd = req.params.symbol.toUpperCase();
    // use lodash to find index for stock with this symbol
    let indx = _.findIndex(stocks, ['symbol', symbolToAdd]);
    // if didn't find it, then return message
    if (indx > 0) {
        resp.json(jsonMessage(`${symbolToAdd} already exists`));
    }
    else {
        // add new symbol
        stocks.push(req.body);
        // let requestor know it worked
        resp.json(jsonMessage(`${symbolToAdd} added`));
    }
};
const deleteSymbol = (stocks, req, resp) => {
    const symbolToDel = req.params.symbol.toUpperCase();
    // use lodash to find index for stock with this symbol
    let indx = _.findIndex(stocks, ['symbol', symbolToDel]);
    // if didn't find it, then return message
    if (indx < 0) {
        resp.json(jsonMessage(`${symbolToDel} not found`));
    }
    else {
        // symbol found, so remove it
        _.remove(stocks, ['symbol', symbolToDel]);
        // let requestor know it worked
        resp.json(jsonMessage(`${symbolToDel} removed`));
    }
};

module.exports = {
 findSymbol,
 updateSymbol,
 findName,
 findPrices,
 insertSymbol,
 deleteSymbol
};