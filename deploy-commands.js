"use strict";

const fs = require('fs');
const { Routes, REST } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const c = require(`./commands/${file}`);
	commands.push(c.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		let data;
		// The put method is used to fully refresh all commands in the guild with the current set
		if (guildId) {
			data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		} else {
			data = await rest.put(Routes.applicationCommands(clientId), { body: commands })
		}
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();