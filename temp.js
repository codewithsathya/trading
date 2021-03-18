const axios = require('axios');

async function check() {
    let urlWazirx = 'https://api.wazirx.com/api/v2/market-status';
    let wazirxData = await axios.get(urlWazirx);
    let coinusdt = wazirxData.data.markets.filter(function (value, index, arr) {
        return value.status == 'active' && value.quoteMarket == 'usdt';
    });
    let arr = [];
    for (let item of coinusdt) {
        let urlBinance = `https://api.binance.com/api/v3/avgPrice?symbol=${item.baseMarket.toUpperCase()}USDT`;
        try {
            let binanceData = await axios.get(urlBinance);
            if (binanceData) {
                arr.push(item.baseMarket);
            }
        } catch (error) {

        }
    }
    str = "";
    for (let i = 0; i < arr.length; i++) {
        str += `'${arr[i]}', `;
    }
    console.log(str);
}

check();