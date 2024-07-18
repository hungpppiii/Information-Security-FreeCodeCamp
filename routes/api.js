'use strict';

const crypto = require('crypto');

let likes = {};

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      let stockData;

      if (typeof req.query?.stock === 'string') {
        const data = await handleForEachStock(req.query.stock, req.query.like, req.headers['x-forwarded-for']);

        stockData = { stock: data.symbol, price: data.latestPrice, likes: likes[req.query.stock]?.length }
      } else if (req.query?.stock instanceof Array) {
        stockData = [];
        for (let i = 0; i < req.query.stock.length; i++) {
          const data = await handleForEachStock(req.query.stock[i], req.query.like, req.headers['x-forwarded-for'])
          stockData.push({
            stock: data.symbol, price: data.latestPrice, rel_likes: likes[req.query.stock[i]]?.length
          })
        }
      }

      return res.json({ stockData });
    });

};

function generateIPHash(ip) {
  return crypto.createHash('md5').update(JSON.stringify(ip ?? 'testIp')).digest('hex');
}

async function handleForEachStock(stock, like, ip) {
  const data = await queryStock(stock);
  if (!likes[stock]) {
    likes[stock] = []
  }

  if (like === 'true') {
    const ipHash = generateIPHash(ip);
    if (!likes[stock]?.includes(ipHash)) {
      likes[stock].push(ipHash);
    }
  }
  return data;
}

async function queryStock(stock) {
  return await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
    .then(res => res.json())
    .catch(err => console.error(err))
}