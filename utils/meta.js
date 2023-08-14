"use strict";
import { EmbedBuilder } from "discord.js";

export function newEmbed(userTrigger) {
    let embed = new EmbedBuilder().setColor('#000000')
    if (userTrigger) {
        embed.setFooter({ text: `${userTrigger.username}#${userTrigger.discriminator}`, iconURL: userTrigger.displayAvatarURL() });
    }
    return embed
}

export function errorEmbed(title, desc, userTrigger) {
    return newEmbed(userTrigger).setTitle(`:x: ${title}`).setDescription(desc.toString())
}