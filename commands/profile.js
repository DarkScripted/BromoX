"use strict";
import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle } from "discord.js";
import { getUser } from "../utils/getfromapi.js";
import { errorEmbed, newEmbed } from "../utils/meta.js";
import { userRegexp, userRegexpStrict } from "../regexp/parse.js";
import { invalidUsername } from "../utils/invalid.js";
import { sleep } from "../utils/utils.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Obtener un perfíl con el link o username de este.')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('El username o url del usuario.')
                .setRequired(true)
        ),
    async execCmd(interaction) {
        let username, re, data
        if (re = userRegexp.exec(interaction.options.get("user").value)) {
            username = re[1]
        } else {
            username = interaction.options.get("user").value
        }

        if (invalidUsername(username)) {
            await interaction.reply({ embeds: [errorEmbed("Pelotudo", "Debes de insertar un link o username valido.")] });
            return
        }

        try {
            data = await getUser(username)
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

        await interaction.reply({ embeds: [embed(newEmbed(), data["user_profile"])], components: [addButtons(data["user_profile"])] });
    },

    triggerRegexp: userRegexpStrict,
    // se ejecuta al crearse un mensaje
    async execMsg(message, user) {
        if (invalidUsername(user[1])) {
            return
        }

        let data;
        try {
            data = await getUser(user[1])
        } catch (error) {
            console.error(error);
            return
        }

        if (data["stat"] != 0) {
            console.log(data)
            return
        }

        try {
            await message.channel.send({ embeds: [embed(newEmbed(message.author), data["user_profile"])], components: [addButtons(data["user_profile"])] });
            await message.delete(1000)
        } catch (error) {
            console.error(error);
        }
    },
    buttons: {
        "ban": {
            premiumLevel: 2,
            async exec(interaction) {
                await interaction.deferReply()
                await sleep(5000);
                await interaction.editReply({ embeds: [errorEmbed("Error", "Uh algo ha pasado, intentalo de nuevo más tarde.", interaction.user)] });
            }
        }
    }
};

function addButtons(data) {
    let component = new ButtonBuilder()
        .setEmoji("🖼️")
        .setLabel('Raw')

    if (data["avatar_url"]) {
        component.setURL(data["avatar_url"]).setStyle(ButtonStyle.Link);
    } else {
        component.setDisabled(true).setStyle(ButtonStyle.Secondary).setCustomId("dummy");
    }

    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('ban')
            .setEmoji("🔨")
            .setLabel('Ban')
            .setStyle(ButtonStyle.Danger),
        component
    )
}

function embed(embed, data) {
    embed.setTitle(`Perfíl de ${data.username}`).setURL(`https://es.memedroid.com/user/view/${encodeURIComponent(data.username)}`)
        .addFields(
            { name: 'Puntuación', value: data["score"].toString(), inline: true },
            { name: 'País', value: addCountry(data["country"]), inline: true },
            { name: 'Seguidores', value: data["followers_count"].toString(), inline: true },
        )
    if (data["avatar_url"]) {
        embed.setImage(data["avatar_url"])
    }
    if (data["status"]) {
        embed.setDescription(data["status"])
    }

    return embed
}

function addCountry(code) {
    if (!code || code == "ZZ") {
        return `:grey_question:`
    }
    return `:flag_${code.toLowerCase()}:`
}