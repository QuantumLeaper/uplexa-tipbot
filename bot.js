const lang = require('./bot/lang')
const { debug } = require('./bot/log')
const { tipbot } = require('./config.json')
const { getBalance } = require('./bot/redis')
const { BOT_NAME } = require('./bot/constants')
const send = require('./bot/commands/send')
const withdraw = require('./bot/commands/withdraw')
const walletAddress = require('./bot/commands/address')
const discord = require('./bot/discord')

/*
  Todo:
    -Store last scanned blockheight and scan from 720 blocks prior to that (1 days) ((Instead of just scanning 1440 blocks prior to current block))
    -If no recorded scanheight, scan from beginning of blockchain (0)
    -Add feature to log all sends between users & withdrawals.
    -Double check on 3rd confirmation, mark as stale if transaction was not approved.
    -Add faucet
    -Add lottery
    -Add rain command (reward past 5 active users)
    -Spam chat log on October 23rd at 18:23UTC with "Happy birthday uPlexa"
    -Randomly start spraying rewards at people.
*/

const handleRes = (res, msg) => {
  if (res.success === true || res.success === false) {
    msg.channel.send(res.message)
    return
  }

  msg.channel.send(lang.err)
}

discord.on('message', async msg => {
  const { author, channel, content: m } = msg

  const uname = author.username
  const uid = author.id
  const c = channel.name || 'private'
  const cid = channel.id

  // const isAdmin = m.includes('$upx.') && adminMode === '1' && uid === adminID
  // if (!isAdmin) return

  const isCmd = m.substring(0, 4).includes('$upx')
  if (!isCmd) return
  if (uname === BOT_NAME) return

  const [cmdName, ...args] = m.substring(5).split(' ')

  debug('USER MESSAGES', `[${c}] ${uname}: ${m}`)
  debug('ARGS', args)
  debug('CMDNAME', cmdName)

  // TipBot Channels
  const commands = async command => {
    debug(command)
    switch (command) {
      case 'send': {
        // eg. !send 25 @user
        const res = await send(args, uname, uid)
        return handleRes(res, msg)
      }

      case 'balance': {
        const balance = await getBalance(uid)
        msg.channel.send(lang.balance(uname, balance))
        return
      }

      case 'about': {
        msg.channel.send(lang.iAmTipBot)
        return
      }

      case 'address':
      case 'withdraw': {
        if (c !== 'private') msg.channel.send(lang.private(uname))
        break
      }

      case 'help':
      default: {
        if (c === 'private') break // this will appear again in private
        msg.channel.send(lang.imJustABotWarning)
      }
    }
  }

  // Private Channels
  const privateCommands = async command => {
    switch (command) {
      case 'address': {
        const res = await walletAddress(uname, uid)
        return handleRes(res, msg)
      }

      case 'balance': {
        const balance = await getBalance(uid)
        msg.channel.send(lang.balance(uname, balance))
        return
      }

      case 'withdraw': {
        const res = await withdraw(args, uname, uid)
        return handleRes(res, msg)
      }

      default: {
        msg.channel.send(lang.imJustABotWarning)
      }
    }
  }

  if (tipbot.channels.indexOf(cid) >= 0) await commands(cmdName)
  if (c === 'private') await privateCommands(cmdName)
})
