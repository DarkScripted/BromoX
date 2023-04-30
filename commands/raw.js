"use strict";
const { SlashCommandBuilder } = require('discord.js');

const { getMeme } = require('../utils/getfromapi.js');
const { errorEmbed } = require('../utils/meta.js');
const { userRegexp, memeRegexp, idRegexp } = require("../regexp/parse.js")
const { invalidMeme, invalidUsername } = require('../utils/invalid.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('raw')
        .setDescription('Obtiene el link de la imagen/video de algún objeto.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription('Obtiene el link del avatar del usuario especificado.')
                .addStringOption(option =>
                    option.setName('username')
                        .setDescription('El username o url del usuario.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('meme')
                .setDescription("Obtiene el link de la imagen/video del meme especificado.")
                .addStringOption(option =>
                    option.setName('item')
                    .setDescription('La ID o link del meme.')
                    .setRequired(true)
                )
        ),

    async execCmd(interaction) {
        if (interaction.options.getSubcommand() == "meme") {
            execMeme(interaction)
        } else {
            execProfile(interaction)
        }
    },

};

async function execMeme(interaction) {
    let memeid, re, data
    if (re = memeRegexp.exec(interaction.options.get("item").value) ) {
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
    if (data.items[0].type == 2 || data.items[0].type == 3) {
        data.items[0].url = data.items[0].url.replace(".jpeg", ".mp4")
    }
    await interaction.reply({ content: `[${data.items[0].title}](${data.items[0].url})` });
}

async function execProfile(interaction) {
    let username, re
    if (re = userRegexp.exec(interaction.options.get("username").value)) {
        username = re[1]
    } else {
        username = interaction.options.get("username").value
    }

    if (invalidUsername(username)) {
        await interaction.reply({ embeds: [errorEmbed("Pelotudo", "Debes de insertar un link o username valido.")] });
        return
    }
    
    await interaction.reply({ content: `[avatar de ${username}](https://appv2.memedroid.com/user_profile/get_user_avatar?username=${username})` });
}