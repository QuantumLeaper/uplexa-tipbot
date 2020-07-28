// Dyanmic.js takes care of all dynamic functionality (withdrawls, queing, scanning blockchains,  etc)
var uplexaWallet = require('uplexa-nodejs');
var async = require('async');
const redis = require('redis');
const crypto = require('crypto');
global.config = require('./config.json');

let heightScan = 1440; // Scan last 90 blocks = 3 hours. (90*2)
var node;
var port;

var decimals = 100; // pow(10^2)

if (global.config.coinConfig.nettype == 'mainnet') {
  node = global.config.nodes.upx.mainnet.rpcHost;
  port = global.config.nodes.upx.mainnet.rpcPort;
}

if (global.config.coinConfig.nettype == 'testnet') {
  node = global.config.nodes.upx.testnet.rpcHost;
  port = global.config.nodes.upx.testnet.rpcPort;
}

var Wallet = new uplexaWallet(node, port);
let redisClient = redis.createClient(global.config.redis);

Wallet.open_wallet(global.config.coinConfig.walletName); //Initiate wallet before any functions, only open once.

function scanChain(Wallet, redisClient) {
  Wallet.height().then(result => {
    let height = result.height;
    console.log('Current height: ' + height);
    let scanHeight = height - heightScan;
    Wallet.getBulkPayments('', scanHeight).then(result => {
        var transactions = result;
        //console.log(result);
        for (let result of transactions.payments) {
          let tx_height = result.block_height;
          let payment_id = result.payment_id.substr(0, 16); //Trim them 0's
          let tx_hash = result.tx_hash;
          let amount = result.amount;
          let confirms = height - tx_height;
          let userID = 1; // debug purposes

          redisClient.exists(tx_hash, function(err, reply) {
            // Check if TX already exists

            if (reply === 0) {
              console.log(
                'Amount: ' +
                amount +
                '\nTX Hash: ' +
                tx_hash +
                '\nPayment ID:' +
                payment_id +
                '\nConfirmations: ' +
                confirms,
              );
              redisClient.hset('unconfirmed', tx_hash, amount);
              redisClient.hset(
                'upx[' + payment_id + ']',
                tx_hash,
                tx_height + '[' + amount + ']',
              ); //Better
              redisClient.hset(tx_hash, 'amount', amount);
              redisClient.hset(tx_hash, 'height', tx_height);
              redisClient.hset(tx_hash, 'payment_id', payment_id);
              redisClient.hset(tx_hash, 'confirms', confirms);
            } else {
              redisClient.hset(tx_hash, 'confirms', confirms);
            }
          });
        }

    });
  });
}

function checkUnconfirmed(Wallet, redisClient) {
  redisClient.hgetall('unconfirmed', function(err, transactions) {
    if (transactions) {
      var txlist = Object.keys(transactions);
      txlist.forEach(function(transaction) {
        console.log(transaction);
        console.log('----------');
        redisClient.hgetall(transaction, function(err, result) {
          if (result) {
            if (result['confirms'] >= 3) {
              // Confirmation level set to 3 for now.
              var paymentID = result['payment_id'];
              var amount = result['amount'];
		console.log(amount);
              redisClient.hget('users_upx', paymentID, function(err, uid) {
                try {
                  redisClient.hincrby(uid, 'upx.balance', amount);
                  redisClient.hdel('unconfirmed', transaction);
                  redisClient.hset('confirmed', transaction, '0');
                  console.log(
                    'Credited uid: ' +
                    uid +
                    ' with ' +
                    amount +
                    ' UPX via TX: ' +
                    transaction,
                  ); //It's because of transaction.
                } catch (e) {
                  console.log(e);
                }
              });
            }
          }
        });
      });
    }
  });
}

setInterval(scanChain, 5 * 1000, Wallet, redisClient);
setInterval(checkUnconfirmed, 5 * 1000, Wallet, redisClient);
