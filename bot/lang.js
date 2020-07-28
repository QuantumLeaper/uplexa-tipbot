module.exports = {
  ready: tag => `Logged in as ${tag}!`,

  err: `Something went wrong. Please contact an admin.`,

  private: uname => `${uname}, this command must be used by private messaging me!`,

  cannotSendToSelf: uname =>
    `${uname}, please send UPX to someone that is not yourself. :rolling_eyes:`,

  specifyAUser: uname =>
    `${uname}, please provide a user to send to: \`$upx.send AMOUNT @user\`.`,

  createWalletErr: uname =>
    `${uname}, something went wrong creating a wallet for you. Please contact an admin.`,

  withdrawalErr: uname =>
    `${uname}, something went wrong with this withdrawal. Please contact an admin.`,

  withdrawalSuccess: (uname, amount, fee, txHash) =>
    `${uname}, Withdrawal for ${amount} UPX successfully processed!:\n\`\`\` ${txHash} \`\`\` (TXFee: ${fee}) :money_with_wings:`,

  walletLocked: uname =>
    `${uname}, my wallet is currently locked. Please try again in a few minutes.`,

  invalidUplexaAddr: uname => `${uname}, that is not a valid uPlexa address.`,

  insufficientBalance: (uname, amountFixed, balance) =>
    `${uname}, you cannot withdraw ${amountFixed} UPX because your balance is only ${balance} :disappointed_relieved:`,

  withdrawMoreThanZero: uname =>
    `${uname}, you cannot withdraw zero UPX, what world are you from? :laughing:`,

  sendMoreThanNegative: uname =>
    `${uname} + ', you cannot withdraw negative amounts :laughing:`,

  youHaveSentTo: (uname, recipient, amountFixed) =>
    `${uname} has sent ${recipient} ${amountFixed} UPX :money_with_wings:`,

  userSentToNotExist: uname =>
    `${uname}, the user you're sending UPX to does not exist in the PlexaVerse`,

  insufficientBalanceForSend: (uname, amountFixed, balance) =>
    `${uname}, you cannot send ${amountFixed} UPX because your balance is only ${balance} :disappointed_relieved:`,

  sendMoreThanZero: uname =>
    `${uname}, you cannot send zero UPX, what world are you from? :laughing:`,

  sendMoreThanNegative: uname =>
    `${uname} + ', you cannot send negative amounts :laughing:`,

  invalidArgument: (uname, arg) =>
    `What are you trying to do ${uname}? (${arg})...`,

  balance: (uname, balance) =>
    `${uname}, Your balance is:\n\`\`\` ${balance} UPX\`\`\``,

  walletAddress: (uname, address) =>
    `${uname}, Your wallet address is:\n\`\`\`${address}\`\`\``,

  iAmTipBot:
    'I am uPlexa Tipbot, I was created by QuantumL3aper: ```https://github.com/QuantumLeaper/uplexa-tipbot\nhttps://twitter.com/quantuml3aper ```',

  imJustABotWarning:
    '** WARNING: I should NOT be used as your primary wallet!\nI am just a bot! BLEEP BLOOP :robot: **\n```Commands:\n---PUBLIC---\n$upx.send AMOUNT @user\t (Send some UPX to a user)\n$upx.about\t\t\t (Bot Information)\n$upx.balance\t\t\t (Check your balance)\n--PRIVATE (DM)--\n$upx.address\t\t\t (Get your UPX wallet address)\n$upx.withdraw AMOUNT WALLET (Static TX fee of 2.46 UPX)```',
}
