const Discord = require('discord.js')
const { discord } = require('./../config.json')
const lang = require('./lang')
const { log } = require('./log')

const discordClient = new Discord.Client()

discordClient.on('ready', () => log(lang.ready(discordClient.user.tag)))
discordClient.login(discord.token)

module.exports = discordClient
