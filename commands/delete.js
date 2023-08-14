"use strict";
import { SlashCommandBuilder } from "discord.js";
import { errorEmbed } from "../utils/meta.js";
import { sleep } from "../utils/utils.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Elimina los objetos especificados.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('meme')
                .setDescription('Elimina los memes especificados.')
                .addStringOption(option =>
                    option.setName('ids')
                        .setDescription('Las URLs o IDs de los memes (Separados por cualquier caracter no-numerico)')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('comment')
                .setDescription("Elimina los comentarios especificados.")
                .addIntegerOption(option =>
                    option.setName('ids')
                        .setDescription('Las IDs de los comentarios (Separados por cualquier caracter no-numerico)')
                        .setRequired(true)
                )
        ),

        async execCmd(interaction) {
            await interaction.deferReply()
            await sleep(5000);
            await interaction.editReply({ embeds: [errorEmbed("Error", "Uh algo ha pasado, intentalo de nuevo más tarde.", interaction.user)]});
        },
        premiumLevel: 2
};