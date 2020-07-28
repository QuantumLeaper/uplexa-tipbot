const lang = require('./../lang')
const discord = require('../discord')
const { incBalance, getBalance, recreditUser } = require('./../redis')
const { DECIMALS } = require('./../constants')
const { discord: discordConfig } = require('./../../config.json')

const { guild: guildID } = discordConfig

const send = async (args, uname, uid) => {
  const receiver = args[1].replace(/[@<>!]/g, '')
  console.log(receiver);
  if (uid === receiver) {
    return { success: false, message: lang.cannotSendToSelf(uname) }
  }

  if (args[1] === undefined) {
    return { success: false, message: lang.specifyAUser(uname) }
  }

  const amount = Number(args[0])
  if (!Number.isInteger(amount)) {
    return {
      success: false,
      message: lang.invalidArgument(uname, args[0]),
    }
  }

  if (amount === 0) {
    return { success: false, message: lang.sendMoreThanZero(uname) }
  }

  if (amount < 0) {
    return { success: false, message: lang.sendMoreThanNegative(uname) }
  }

  const guild = discord.guilds.get(guildID)

  if (!guild.member(receiver)) {
    return { success: false, message: lang.userSentToNotExist(uname) }
  }

  const balance = await getBalance(uid)
  if (balance === false) {
    return { success: false, message: lang.err }
  }

  if (balance <= amount) {
    return {
      success: false,
      message: lang.insufficientBalanceForSend(
        uname,
        amount.toFixed(2),
        balance
      ),
    }
  }

  const take = (amount / amount - 1 - amount) * DECIMALS
  const receive = amount * DECIMALS

  // Take from user
  let res = await incBalance(uid, take)
  if (res === false) {
    return { success: false, message: lang.err }
  }

  // Give to reciever
  res = await incBalance(receiver, receive)
  if (res === false) {
    await recreditUser(uid, receive)
    return { success: false, message: lang.err }
  }

  return {
    success: true,
    message: lang.youHaveSentTo(uname, args[1], amount.toFixed(2)),
  }
}

module.exports = send
