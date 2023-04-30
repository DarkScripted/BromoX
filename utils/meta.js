"use strict";
const { EmbedBuilder } = require('discord.js');

module.exports = {
    errorEmbed,
    newEmbed
};

function newEmbed(userTrigger) {
    let embed = new EmbedBuilder().setColor('#000000')
    if (userTrigger) {
        embed.setFooter({ text: `${userTrigger.username}#${userTrigger.discriminator}`, iconURL: userTrigger.displayAvatarURL() });
    }
    return embed
}

function errorEmbed(title, desc, userTrigger) {
    return newEmbed(userTrigger).setTitle(`:x: ${title}`).setDescription(desc.toString())
}