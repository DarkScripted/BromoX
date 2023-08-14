"use strict";
import config from '../config.json' assert {"type": "json"};
/*
3 = privileged user
2 = permission granted
1 = server premium but permission denied
0 = poor and gay server
*/
export function isPremium(userId, serverId) {
    if (config.privilegedUsers.includes(userId)) return 3;
    if (!(serverId in config.privilegedServers)) return 0;
    return config.privilegedServers[serverId].includes(userId) ? 2 : 1
}

export function serverPremium(serverId) {
    return config.privilegedServers.includes(serverId)
}

export function notPremiumEmbed(premiumLevel, embed) {
    switch (premiumLevel) {
        case 0:
            return embed.setTitle(`Esta función requiere de BromoX Premium`)
                .setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
                .setDescription("Ejecuta `/premium` para saber más detalles.")
        case 1 || 3:
            return embed.setTitle(`XD`)
                .setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
                .setDescription("No tienes permiso para usar este comando.")
    }
}