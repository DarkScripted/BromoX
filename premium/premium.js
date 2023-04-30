"use strict";
const { privilegedServers, privilegedUsers } = require('../config.json');

module.exports = {
    isPremium,
    serverPremium,
    premiumEmbed,
    deniedEmbed
}

/*
3 = privileged user
2 = permission granted
1 = server premium but permission denied
0 = poor and gay server
*/
function isPremium(userId, serverId) {
    if (privilegedUsers.includes(userId)) return 3;
    if (!serverId in privilegedServers) return 0;
    return privilegedServers[serverId].includes(userId) ? 2 : 1
}

function serverPremium(serverId) {
    return privilegedServers.includes(serverId)
}

function premiumEmbed(embed) {
    return embed.setTitle(`Esta función requiere de BromoX Premium`)
        .setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
        .setDescription("Ejecuta `/premium` para saber más detalles.")
}

function deniedEmbed(embed) {
    return embed.setTitle(`XD`)
        .setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
        .setDescription("No tienes permiso para usar este comando.")
}