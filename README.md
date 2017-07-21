# command-usage
`command-usage` is a plugin for Discord bots that are written with YAMDBF+Discord.js
that gives the ability to have commands logged to a specified channel and to view
command usage statistics via a `usagestats` command.

# Usage
>Note: Until YAMDBF 3.0.0 is officially released, I'm not going to be pushing updates
for this on NPM. In the meantime, you can install directly from github with
`npm install --save zajrik/yamdbf-command-usage`

Install the package via `npm`:
```
npm install --save yamdbf-command-usage
```

There are two ways to use the plugin after installing. The first is a simple automatic
import by passing `'command-usage'` to your YAMDBF Client options `plugins` array field:
```js
const { Client } = require('yamdbf');

const client = new Client({
	...
	plugins: ['command-usage']
});
```

The second is via a manual import, which will give access to command logging via a specified
guild text channel. You must import `commandUsage` from the plugin and pass it to your
YAMDBF Client options `plugins` array field with the channel ID of the channel you want
commands to be logged to:
```js
const { Client } = require('yamdbf');
const { commandUsage } = require('yamdbf-command-usage');

const client = new Client({
	...
	plugins: [commandUsage('channelID')]
});
```

If you find any problems or have any suggestions, don't hesitate to open up an issue.
