const redis = require('redis')
const { promisify } = require('util')
const { error } = require('./log')
const { DECIMALS } = require('./constants')
const { redis: redisConfig } = require('./../config.json')

const redisClient = redis.createClient(redisConfig) // Initiate Redis

const hget = promisify(redisClient.hget).bind(redisClient)
const hset = promisify(redisClient.hset).bind(redisClient)
const hexists = promisify(redisClient.hget).bind(redisClient)
const hincrby = promisify(redisClient.hincrby).bind(redisClient)

const getWalletAddress = async uid => {
  try {
    const address = await hget(uid, 'upx.address')
    return address
  } catch (err) {
    error(err)
    return false
  }
}

const incBalance = async (uid, incBy) => {
  try {
    const res = await hincrby(uid, 'upx.balance', incBy)
    return res
  } catch (err) {
    error(err)
    return false
  }
}

const recreditUser = async (uid, amount) => {
  const res = await incBalance(uid, amount)
  if (res === false) {
    error(`Could not recredit user ${uid} ${amount}`)
    return
  }

  if (!res) error(`Could not recredit user ${uid} ${amount}`)
}

const getBalance = async uid => {
  try {
    const balance = await hget(uid, 'upx.balance')
    const nrmlBalance = (balance / DECIMALS).toFixed(2)
    return nrmlBalance
  } catch (err) {
    error(err)
    return false
  }
}

module.exports = {
  getWalletAddress,
  incBalance,
  recreditUser,
  getBalance,
  hset,
  hexists,
}
