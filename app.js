const axios = require('axios');
const play = require('audio-play');
const load = require('audio-loader');


let swit = 1;

function alertMusic(diff) {
    if (diff > 3 && swit == 1) {
        load('./sounds/sound.mp3').then(play);
    }
}

function loop() {
    startTradeTricks();
    setTimeout(loop, 6000);
}

async function startTradeTricks() {
    console.log("-----------------------------");
    let urlWazirx = 'https://api.wazirx.com/api/v2/market-status';
    let wazirxData = await axios.get(urlWazirx);
    let arr = ['ada', 'atom', 'bnb', 'btc', 'doge', 'eos', 'eth', 'link', 'uni', 'wrx', 'zec', 'enj', 'xem', 'vet', 'hbar', 'uma'];
    arr.forEach((coin, index, arr) => calculate(coin, index, arr, wazirxData));
    // console.log("-----------------------------");
}

async function calculate(coin, index, arr, wazirxData) {
    let urlBinance = `https://api.binance.com/api/v3/avgPrice?symbol=${coin.toUpperCase()}USDT`;
    try {
        let binanceData = await axios.get(urlBinance);
        let coinusdt = wazirxData.data.markets.filter(function (value, index, arr) {
            return value.baseMarket == coin && value.quoteMarket == 'usdt';
        })[0];
        let coinusdtBuy = parseFloat(coinusdt.buy);
        let coinusdtSell = parseFloat(coinusdt.sell);
        let bincoin = parseFloat(binanceData.data.price);
        let coininr = wazirxData.data.markets.filter(function (value, index, arr) {
            return value.baseMarket == coin && value.quoteMarket == 'inr';
        })[0];
        let usdtinr = wazirxData.data.markets.filter(function (value, index, arr) {
            return value.baseMarket == 'usdt' && value.quoteMarket == 'inr';
        })[0];
        let coinConvBuy = (parseFloat(coininr.buy) / parseFloat(usdtinr.sell)).toPrecision(7);
        let coinConvSell = (parseFloat(coininr.sell) / parseFloat(usdtinr.buy)).toPrecision(7);
        if (hasGain(bincoin, coinConvBuy, coinConvSell, coinusdtBuy, coinusdtSell)) {
            console.log(coin, coinConvBuy, coinConvSell, coinusdt.buy, coinusdt.sell, binanceData.data.price);
        }
        if (bincoin < coinConvBuy) {
            let diff = ((coinConvBuy - bincoin) / coinConvBuy) * 100;
            alertMusic(diff);
            console.log(diff, "INR");
        } else if (bincoin > coinConvSell) {
            let diff = ((bincoin - coinConvSell) / coinConvSell) * 100;
            alertMusic(diff);
            console.log(diff, "INR")
        }
        if (bincoin < coinusdtBuy) {
            let diff = ((coinusdtBuy - bincoin) / coinusdtBuy) * 100;
            console.log(diff, "USDT");
        } else if (bincoin > coinusdtSell) {
            let diff = ((bincoin - coinusdtSell) / bincoin) * 100;
            console.log(diff, "USDT");
        }
        if (coinusdtSell < coinConvBuy) {
            let diff = ((coinConvBuy - coinusdtSell) / coinConvBuy) * 100;
            console.log(diff, "Internal");
        } else if (coinConvSell < coinusdtBuy) {
            let diff = ((coinusdtBuy - coinConvSell) / coinusdtBuy) * 100;
            console.log(diff, "Internal");
        }
    } catch (err) {
        console.log(err.response.data.msg);
    }
}

loop();

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