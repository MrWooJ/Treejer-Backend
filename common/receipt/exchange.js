const utility = rootRequire('helper/utility');
let unirest = require('unirest');

module.exports = async Receipt => {

  Receipt.exchange = async amount => 
  unirest
  .get('https://min-api.cryptocompare.com/data/price')
  .type('json')
  .headers({ 
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  })
  .query({
    fsym: 'ETH',
    tsyms: 'EUR'
  })
  .then(response => {
    let ethAmount = Number(amount) * Number(response.body.EUR);
    return {
      ethPrice: ethAmount,
      date: utility.getUnixTimeStamp(),
      ethExchange: response.body
    };
  });

  Receipt.exchange = utility.wrapper(Receipt.exchange);

  Receipt.remoteMethod('exchange', {
    description: 'Exchange Provided Dollar to ETH at Moment',
    accepts: [{
      arg: 'amount',
      type: 'string',
      required: true,
      http: {
        source: 'query'
      }
    }],
    http: {
      path: '/exchange',
      verb: 'GET',
      status: 200,
      errorStatus: 400
    },
    returns: {
      type: 'object',
      root: true
    }
  });

};