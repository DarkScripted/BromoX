"use strict";
const fs = require('fs');
const { Client, Collection, GatewayIntentBits, ActivityType, PresenceUpdateStatus } = require('discord.js');
const { token } = require('./config.json');
const { errorEmbed, newEmbed } = require('./utils/meta.js');
const { cooldown, cooldownGC, cdInterval, cdLog } = require("./cooldown/cooldown.js")
const { deniedEmbed, premiumEmbed, isPremium } = require("./premium/premium.js")
const { LogCommand, LogMessage, LogButton } = require("./utils/logging.js")
const client = new Client({
	intents:[
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});
const msgTriggers = [], buttonInteraction = {};


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


// register commands and events
for (const file of commandFiles) {
	const c = require(`./commands/${file}`);
	client.commands.set(c.data.name, c);
	if (c.hasOwnProperty('triggerRegexp')) {
		msgTriggers.push(c.data.name)
	}
	if (c.hasOwnProperty('buttons')) {
		for (const id in c.buttons) {
			buttonInteraction[id] = c.data.name
		}
	}
}

client.once('ready', () => {
	client.user.setActivity({
		name: "bromomentos",
		type: ActivityType.Watching,
	})
	client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
	console.log(buttonInteraction)
	console.log('Ready!');
});

function notPremiumEmbed(premiumLevel, embed) {
	switch (premiumLevel) {
		case 0:
			return premiumEmbed(embed)
		case 1 || 3:
			return deniedEmbed(embed)
	}
}

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

client.login(token);
