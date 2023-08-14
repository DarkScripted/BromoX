"use strict";
import * as fs from 'fs';
import { Client, Collection, GatewayIntentBits, ActivityType, PresenceUpdateStatus } from "discord.js";
import { errorEmbed, newEmbed } from "./utils/meta.js";
import { cooldown, cooldownGC, cdInterval, cdLog } from "./cooldown/cooldown.js";
import { notPremiumEmbed, isPremium } from "./premium/premium.js";
import { LogCommand, LogMessage, LogButton } from "./utils/logging.js";
import config from './config.json' assert {"type": "json"};

const client = new Client({
	intents:[
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	],
});
client.commands = new Collection();
const msgTriggers = [], buttonInteraction = {};
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// register commands and events
for (const file of commandFiles) {
	const commandFile = await import(`./commands/${file}`);
	client.commands.set(commandFile.command.data.name, commandFile.command);
	
	if (commandFile.command.hasOwnProperty('triggerRegexp')) {
		msgTriggers.push(commandFile.command.data.name)
	}
	if (commandFile.command.hasOwnProperty('buttons')) {
		for (const id in commandFile.command.buttons) {
			buttonInteraction[id] = commandFile.command.data.name
		}
	}
}

client.once('ready', () => {
	client.user.setActivity({
		name: "bromomentos",
		type: ActivityType.Watching,
	})
	client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
	console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	LogCommand(interaction)

	if (cooldown(interaction.user.id)) {
		await interaction.reply({ embeds: [errorEmbed("Pelotudo", "Deja de spamear.")], ephemeral: true })
		return
	};

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	const pr = isPremium(interaction.user.id, interaction.guildId)
	if (command.premiumLevel && pr < command.premiumLevel) {
		await interaction.reply({ embeds: [notPremiumEmbed(pr, newEmbed())] });
		return
	}
	try {
		await command.execCmd(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	LogMessage(message)
	await Promise.all(msgTriggers.map(async (e) => {
		const command = client.commands.get(e);
		if (!command) return;
		let regexp = command.triggerRegexp.exec(message.content)
		if (!regexp) return;

		if (cooldown(message.author.id)) {
			await message.reply({ embeds: [errorEmbed("Pelotudo", "Deja de spamear.", message.author)] })
			return
		};

		try {
			await command.execMsg(message, regexp);
		} catch (error) {
			console.error(error);
		}
	}))
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton() || !buttonInteraction[interaction.customId]) return;
	LogButton(interaction)
	if (cooldown(interaction.user.id)) return;
	const command = client.commands.get(buttonInteraction[interaction.customId]);
	if (!command) return;

	const l = command.buttons[interaction.customId].premiumLevel
	const pr = isPremium(interaction.user.id, interaction.guild.id)
	if (l && pr < l) {
		await interaction.reply({ embeds: [notPremiumEmbed(pr, newEmbed(interaction.user))] });
		return
	}

	try {
		await command.buttons[interaction.customId].exec(interaction);
	} catch (error) {
		console.error(error);
	}
})

setInterval(cooldownGC, cdInterval)
//setInterval(cdLog, 500)

client.login(config.token);
