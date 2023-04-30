"use strict";
const { SlashCommandBuilder } = require("discord.js");
const { newEmbed } = require('../utils/meta.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sobremi')
		.setDescription('Información miscelanea sobre BromoX.'),
	async execCmd(interaction) {
		const embed = new newEmbed()
			.setTitle("BromoX Beta 3")
			.setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
			.setDescription(`Bromox es un bot de Memedroid con el fin de facilitar tus domadas y trolleadas esta comunidad llena de de downs`)
			.addFields(
				{ name: 'Lo Gigachad', value: "Con él, podrás borrar memes de mierda, borrar comentarios, banear usuarios y tener el control total del sistema de puntuación entre otros usos adicionales."}
			)
			.setFooter({ text: "BromoX fue hecho por Mamarre S.A ", iconURL: "https://cdn.discordapp.com/attachments/943784585693650964/945749117123059812/marselo.png" })
		await interaction.reply({ embeds: [embed] });
	},
};
