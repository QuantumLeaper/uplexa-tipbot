const lang = require('./../lang')
const { getBalance } = require('./../redis')
const { withdraw: walletWithdraw } = require('./../wallet')

const withdraw = async (args, uname, uid) => {
  const regex = /^(UPX)([0-9A-Za-z]){95}|(UPi)([0-9A-Za-z]){106}|(UmV|UmW)([0-9A-Za-z]){94}$/
  // Validate address first.
  if (
    !regex.test(args[1]) ||
    (args[1].includes('UPX') && args[1].length > 98) ||
    (args[1].includes('UPi') && args[1].length > 109) ||
    (args[1].includes('UmW') && args[1].length > 97) ||
    (args[1].includes('UmV') && args[1].length > 97)
  ) {
    return { success: false, message: lang.invalidUplexaAddr(uname) }
  }

  const amount = Number(args[0])
  if (typeof amount !== 'number') {
    return { success: false, message: lang.invalidArgument(uname, args[1]) }
  }

  if (amount < 0) {
    return { success: false, message: lang.withdrawMoreThanNegative(uname) }
  }

  if (amount <= 0) {
    return { success: false, message: lang.withdrawMoreThanZero(uname) }
  }

  const balance = await getBalance(uid)
  // @Kyle you may want to rethink not allowing them to withdraw equal amount
  if (balance <= amount) {
    return {
      success: false,
      message: lang.insufficientBalance(uname, amount.toFixed(2), balance),
    }
  }

  const res = await walletWithdraw(uid, uname, amount, args[1])

  if (res === -37) {
    return { success: false, message: lang.walletLocked(uname) }
  }

  if (res === false) {
    return { success: false, message: lang.withdrawalErr(uname) }
  }

  return {
    success: true,
    message: lang.withdrawalSuccess(res.uname, res.amount, res.fee, res.txHash),
  }
}

module.exports = withdraw
