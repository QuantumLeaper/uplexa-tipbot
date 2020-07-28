const lang = require('./../lang')
const { hexists } = require('./../redis')
const { createWallet } = require('./../wallet')
const { getWalletAddress } = require('./../redis')

const handleAddress = (uname, address) => {
  if (address === false) {
    return { success: false, message: lang.createWalletErr(uname) }
  }

  return { success: true, message: lang.walletAddress(uname, address) }
}

const walletAddress = async (uname, uid) => {
  if (!(await hexists(uid, 'upx.address'))) {
    return handleAddress(uname, await createWallet(uid))
  }

  return handleAddress(uname, await getWalletAddress(uid))
}

module.exports = walletAddress
