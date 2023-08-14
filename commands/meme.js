"use strict";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder  } from "discord.js";
import { getMeme } from "../utils/getfromapi.js";
import { errorEmbed, newEmbed } from "../utils/meta.js";
import { memeRegexpStrict, memeRegexp, idRegexp } from "../regexp/parse.js";
import { unix2time } from "../utils/utils.js";
import { invalidMeme } from "../utils/invalid.js";
import { sleep } from "../utils/utils.js";

export const command = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Obtener un meme con el link o la ID de este.')
		.addStringOption(option =>
			option.setName('item')
				.setDescription('La ID o link del meme.')
				.setRequired(true)
		),
	async execCmd(interaction) {
		let memeid, re, data
		if (re = memeRegexp.exec(interaction.options.get("item").value)) {
			memeid = re[1]
		} else if (re = idRegexp.exec(interaction.options.get("item").value)) {
			memeid = re[0]
		}

		if (!memeid || invalidMeme(memeid)) {
			await interaction.reply({ embeds: [errorEmbed("Pelotudo", "Debes de insertar un link o id valido.")] });
			return
		}

		try {
			data = await getMeme(memeid)
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ embeds: [errorEmbed("Error al contacar la API", error)] });
			return
		}

		if (data["stat"] != 0) {
			await interaction.reply({ embeds: [errorEmbed("Error al contacar la API", `La API ha respondido con el codigo ${data["stat"]}.`)] });
			return
		}
		if (data["items"].length == 0) {
			await interaction.reply({ embeds: [errorEmbed("Error humano", "El meme solicitado no parece existir.")] });
			return
		}

		await interaction.reply({ embeds: [embed(newEmbed(), data.items[0])], components: [addButtons(data.items[0])] });
	},

	triggerRegexp: memeRegexpStrict,
	// se ejecuta al crearse un mensaje
	async execMsg(message, meme) {
		if (invalidMeme(meme[1])) return;

		let data;
		try {
			data = await getMeme(meme[1])
		} catch (error) {
			console.error(error);
			return
		}

		if (data["stat"] != 0 || data["items"].length == 0) return;

		try {
			await message.channel.send({ embeds: [embed(newEmbed(message.author), data.items[0])], components: [addButtons(data.items[0])] });
			await message.delete(1000)
		} catch (error) {
			console.error(error);
		}
	},
	buttons: {
		"deletememe": {
			premiumLevel: 2,
			async exec(interaction) {
				await interaction.deferReply()
				await sleep(5000);
				await interaction.editReply({ embeds: [errorEmbed("Error", "Uh algo ha pasado, intentalo de nuevo más tarde.", interaction.user)] });
			}
		}
	}
};

function addButtons(meme) {
	let url = meme.url, emoji = "🖼️"
	if (meme.type == 2 || meme.type == 3) {
		emoji = "🎞️"
		url = url.replace(".jpeg", ".mp4")
	}

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('deletememe')
			.setLabel("Borrar")
			.setEmoji("🗑️")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setLabel('Raw')
			.setEmoji(emoji)
			.setURL(url)
			.setStyle(ButtonStyle.Link),
		new ButtonBuilder()
			.setLabel('Ver comentarios')
			.setEmoji("💬")
			.setURL(`https://es.memedroid.com/share-meme/${meme.id}/1602734?goComments=1`)
			.setStyle(ButtonStyle.Link)
	);
}

function embed(embed, data) {
	embed.setAuthor({
		name: data["uploader"],
		iconURL: `https://appv2.memedroid.com/user_profile/get_user_avatar?username=${encodeURIComponent(data["uploader"])}&thumb=1`,
		url: `https://es.memedroid.com/user/view/${encodeURIComponent(data["uploader"])}`
	})
		.setTitle("title" in data && data["title"] ? data["title"] : "Sin título")
		.setURL(`https://es.memedroid.com/share-meme/${data["id"]}/1602734`)
		.addFields(
			{ name: 'Porcentaje', value: percent(data["pvotes"], data["votes"]), inline: true },
			{ name: 'Fecha', value: unix2time(data["timestamp"]), inline: true },
			{ name: 'Tipo', value: memetype(data["type"], data["url"]), inline: true },
		)
		.setImage(data["url"])

	if ("tags" in data && data["tags"]) {
		embed.addFields({ name: "Tags", value: genTags(data["tags"]) })
	}

	return embed
}


function memetype(type) {
	switch (type) {
		case 1:
			return "Imagen"
		case 2:
			return "Gif"
		case 3:
			return "Video"
	}
	return "Desconocido"
}

function percent(pvotes, votes) {
	let p = Math.round(100 * pvotes / votes)
	let str = ""
	if (p <= 45) {
		str = ":red_circle:"
	} else if (p > 75) {
		str = ":green_circle:"
	} else {
		str = ":white_circle:"
	}
	return `${str} ${p}% (${votes})`
}

function genTags(tags) {
	let final = "";
	tags.forEach((v) => {
		final += `"${v}" `
	})
	return final
}
