"use strict";
import { readdirSync } from 'fs';
import { REST, Routes } from 'discord.js';
import config from './config.json' assert {"type": "json"};

const commands = [];
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const commandFile = await import(`./commands/${file}`);
	commands.push(commandFile.command.data.toJSON());
}

const rest = new REST().setToken(config.token);

try {
	console.log(`Started refreshing ${commands.length} application (/) commands.`);
	let data;
	// The put method is used to fully refresh all commands in the guild with the current set
	if (config.guildId) {
		data = await rest.put(Routes.applicationGuildCommands(config.clientId, guildId), { body: commands })
	} else {
		data = await rest.put(Routes.applicationCommands(config.clientId), { body: commands })
	}
	console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
	// And of course, make sure you catch and log any errors!
	console.error(error);
}