"use strict";
import { EmbedBuilder, SlashCommandBuilder} from "discord.js";
import { errorEmbed, newEmbed } from "../utils/meta.js";
import config from '../config.json' assert {"type": "json"};

export const command = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .setDescription('Da información sobre BromoX Premium o para comprar este.')
        .addStringOption(option =>
            option.setName('transaction_id')
                .setDescription('La ID de transacción que salga cuando hayas transferido a una de las direcciones del bot.')
        ),
    async execCmd(interaction) {
        if (!interaction.options.get("transaction_id")) {
            const eur = 10 + Math.round(interaction.guild.memberCount * 0.2);
            try {
                const response = await fetch(`https://blockchain.info/tobtc?currency=EUR&value=${eur}`);
                const btc = await response.text();
                await interaction.reply({ embeds: [premiumEmbed(eur, btc )] });
            } catch (error){
                console.log(error)
                
                await interaction.reply({ embeds: [errorEmbed("Error", "Error al obtener el precio actual de Bitcoin...")] });
            }          
            return
        }
        if (interaction.guild.id in config.privilegedServers){
             await interaction.reply({ embeds: [errorEmbed("¿?", "Este servidor parece ya ser premium...")] });
             return;
        }

        try {
            const response = await fetch(`https://blockchain.info/rawtx/${interaction.options.get("transaction_id").value}`);
            if (response.status == 404) {
                interaction.reply({ embeds: [errorEmbed("Error", "Esta transacción no existe o es invalida...")] });
                return 
            }
            const bodyJson = response.json();
            await interaction.reply({ embeds: [transactionEmbed(bodyJson)] });
        } catch (error){
            console.log(error)
            await interaction.reply({ embeds: [errorEmbed("Error", "Error al obtener la transacción...")] });
        }    
        
    }
};

function premiumEmbed(eur, btc) {    
    let embed = new newEmbed()
        .setTitle(`BromoX Premium por ${eur}€`)
        .setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
        .setImage("https://cdn.discordapp.com/attachments/943784585693650964/943797845457248326/rgb-rainbow.gif")
        .setDescription("Con BromoX Premium puedes desbloquear lo más Chad de este, entre ello:")
        .addFields(
            { name: 'Funciones', value: "-Borrar memes de mierda\n-Borrar comentarios sin valor\n-Banear usuarios gilipollas\n-Votar memes y comentarios con +500 votos\n-Aprobar o rechazar memes en moderación\n-Remover cooldown del bot", },
            { name: '¿Como pagar?', value: `Con tu wallet favorita, puedes enviar ${eur}EUR a una de las direcciones que aparezcan abajo, y cuando lo hayas enviado, corres este mismo comando con el parametro "transaction_id" y en este pones la ID de transacción.` },
            { name: 'Cosas a tomar en cuenta', value: "-La cantidad a pagar depende de la cantidad de usuarios del servidor\n-No se acepta PayPal porque PayPal es maricón\n-No se acepta pagar con multiples cryptos para una sola transacción\n-No hay reembolsos\n-No se aceptan NFTs\n-La ID de transacción va a ligarse al server una vez sea introducida.".toString() },
            { name: `Dirección de Bitcoin (${eur}€/${btc}₿)`, value: `\`\`\`${config.btc_address}\`\`\`` },
        )

    return embed
}

function transactionEmbed(data) {
    for (const obj of data.out) {
        console.log(obj.addr)
        if (obj.addr == btc_address) {
            return new EmbedBuilder()
            .setColor('#EDB40A')
            .setTitle(`Transacción`)
            .setThumbnail("https://cdn.discordapp.com/attachments/943784585693650964/943785248125231104/logo.jpg")
            .setDescription("Transacción valida, confirmación pendiente...")
        }
    }

    return errorEmbed("Error", "Esta transacción no tiene la dirección establecida...")
}