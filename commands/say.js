"use strict";
import { SlashCommandBuilder } from "discord.js";
import { errorEmbed } from "../utils/meta.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Solo para los creadores del bot.')
        .addStringOption(option =>
            option.setName('msg')
                .setDescription('El mensaje en sí.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('msg_id')
                .setDescription('El mensaje a responder.')
        )
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('El canal donde enviar el ensaje.')
        ),
    async execCmd(interaction) {
        let msgRef, channel;

        if (interaction.options.get("channel")) {
            channel = await interaction.client.channels.cache.get(interaction.options.get("channel").value)
            if (!channel) {
                await interaction.reply({ embeds: [errorEmbed("Pelotudo", "Este canal no existe.")], ephemeral: true });
                return
            }
        } else {
            channel = interaction.channel
        }

        if (interaction.options.get("msg_id")) {
            try {
                msgRef = await channel.messages.fetch(interaction.options.get("msg_id").value)
            } catch {
                await interaction.reply({ embeds: [errorEmbed("Pelotudo", "Este msgId no existe.")], ephemeral: true });
                return
            }
        }

        if (msgRef) {
            await msgRef.reply({ content: interaction.options.get("msg").value })
        } else {
            await channel.send({ content: interaction.options.get("msg").value })
        }

        await interaction.reply({ content: "Listo.", ephemeral: true })
    },
    premiumLevel: 3
};
