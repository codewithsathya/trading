const axios = require('axios');

let arr = ['btc', 'trx', 'xrp', 'eos', 'eth', 'zil', 'npxs', 'icx', 'ltc', 'tusd', 'hot', 'bat', 'dash', 'zrx', 'bch', 'bchsv', 'pax', 'usdc', 'omg', 'dent', 'iost', 'fun', 'theta', 'xlm', 'xtz', 'btt', 'fet', 'tfuel', 'celr', 'matic', 'ada', 'rvn', 'xmr', 'atom', 'algo', 'link', 'qtum', 'etc', 'iota', 'zec', 'waves', 'ftm', 'enj', 'lsk', 'mana', 'rep', 'blz', 'nano', 'sc', 'xem', 'bts', 'ardr', 'win', 'bnb', 'chz', 'wrx', 'kava', 'ankr', 'busd', 'one', 'hive', 'ftt', 'band', 'jst', 'ctsi', 'chr', 'tomo', 'stmx', 'gxs', 'lrc', 'doge', 'neo', 'storj', 'comp', 'coti', 'dgb', 'snx', 'ren', 'sxp', 'mkr', 'ava', 'srm', 'egld', 'cos', 'nbs', 'aion', 'dot', 'yfi', 'iotx', 'sand', 'uni', 'data', 'uma', 'yfii', 'aave', 'fil', 'crv', 'near', 'hnt', 'avax', 'oxt', 'dock', 'dusk', 'wtc', 'strax', 'inj', 'vet', 'mtl', 'sushi', 'firo'];

// async function check() {
//     let urlWazirx = 'https://api.wazirx.com/api/v2/market-status';
//     let wazirxData = await axios.get(urlWazirx);
//     let coinsusdt = wazirxData.data.markets.filter(function (value, index, arr) {
//         return value.status == 'active' && value.quoteMarket == 'usdt';
//     });
//     for (let item of coinsusdt) {
//         let urlBinance = `https://api.binance.com/api/v3/avgPrice?symbol=${item.baseMarket.toUpperCase()}USDT`;
//         try {
//             let binanceData = await axios.get(urlBinance);
//             if (binanceData) {
//                 arr.push(item.baseMarket);
//                 console.log(item.baseMarket, ',');
//             }
//         } catch (error) {

//         }
//     }
// }

function loop() {
    startTradeTricks();
    setTimeout(loop, 6000);
}

async function startTradeTricks() {
    console.log("-----------------------------");
    console.log()
    let urlWazirx = 'https://api.wazirx.com/api/v2/market-status';
    let wazirxData = await axios.get(urlWazirx);
    arr.forEach((coin, index, arr) => calculate(coin, index, arr, wazirxData));
}

async function calculate(coin, index, arr, wazirxData) {
    let urlBinance = `https://api.binance.com/api/v3/avgPrice?symbol=${coin.toUpperCase()}USDT`;
    try {
        let binanceData = await axios.get(urlBinance);
        let coinusdt = wazirxData.data.markets.filter(function (value, index, arr) {
            return value.baseMarket == coin && value.quoteMarket == 'usdt';
        })[0];
        let coinusdtSell = parseFloat(coinusdt.sell);
        let bincoin = parseFloat(binanceData.data.price);
        let diff = ((bincoin - coinusdtSell) / bincoin) * 100;
        if (diff > 1) {
            console.log(coin, diff);
        }
    } catch (err) {
        console.log(coin);
        console.log(err.response.data.msg);
    }
}

async function start() {
    // await check();
    loop();
}
start();

function hasGain(bincoin, coinConvBuy, coinConvSell, coinusdtBuy, coinusdtSell) {
    return bincoin < coinConvBuy || bincoin > coinConvSell || bincoin < coinusdtBuy || bincoin > coinusdtSell || coinusdtSell < coinConvBuy || coinConvSell < coinusdtBuy;
}



// function check(dogeinr, dogeusdt, usdtinr) {
//     let usdtinrBuy = parseFloat(usdtinr.buy);
//     let usdtinrSell = parseFloat(usdtinr.sell);
//     // console.log(usdtinr.buy);
//     if (parseFloat(dogeinr.sell) < parseFloat(dogeusdt.buy) * usdtinrBuy) {
//         console.log(parseFloat(dogeinr.sell), parseFloat(dogeusdt.buy) * usdtinrBuy);
//         return "Buy doge at INR and sell at USDT";
//     } else if (parseFloat(dogeusdt.sell) * usdtinrSell < parseFloat(dogeinr.buy)) {
//         console.log(parseFloat(dogeusdt.sell) * usdtinrSell, parseFloat(dogeinr.buy));
//         return "Buy doge at USDT and sell at INR";
//     } else {
//         return false;
//     }
// }



// axios.get(urlWazirx).then((res) => {
//             let dogeinr = res.data.markets.filter(function(value, index, arr){
//                 return value.baseMarket == 'doge' && value.quoteMarket == 'inr';
//             })[0];
//             let dogeusdt = res.data.markets.filter(function(value, index, arr){
//                 return value.baseMarket == 'doge' && value.quoteMarket == 'usdt';
//             })[0];
//             let usdtinr = res.data.markets.filter(function(value, index, arr){
//                 return value.baseMarket == 'usdt' && value.quoteMarket == 'inr';
//             })[0];
//             // console.log(dogeinr, dogeusdt, usdtinr);
//             let result = check(dogeinr, dogeusdt, usdtinr);
//             if(result) {
//                 // console.clear();
//                 console.log(result);
//             }
//         });