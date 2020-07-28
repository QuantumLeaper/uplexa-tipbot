# uPlexa Discord Bot
## Authors: QuantumL3aper, blk
## Copyright (c) 2018-2020 uPlexa

Extract uPlexa daemon (uplexad), uPlexa CMD Wallet (uplexa-wallet-cli) and uPlexa RPC (uplexa-wallet-rpc) to ./lib/
https://github.com/uPlexa/uplexa

Create a wallet called "discord" with ``./uplexa-wallet-cli``
Edit wallet_pass to specify wallet password (if set)

Edit configs in config.json. Ensure to input your Discord bot's token, your guild ID, and your admin ID if you're using admin-only mode for testing

Run:
```
pm2 start ./lib/uplexad
pm2 start ./lib/uplexa-wallet-rpc -- --rpc-bind-port 21065 --password-file wallet_pass --wallet-file discord --disable-rpc-login --trusted-daemon
```

To run the bot:
```pm2 start bot.js
pm2 start dynamic.js``

(dynamic.js simply runs wallet mostly wallet related things and stuff)
