"use strict";

function log (type, denied, author, content) {
    console.log(`[${type}] ${author.username}#${author.discriminator}|${author.id}> ${content}`)
}

export async function LogCommand (interaction){
    let finalstr = "";
    for (const opt of interaction.options.data){
        finalstr += `(${opt.name}: ${opt.value})`
    }
    log("Command Execute", false, interaction.user, finalstr)
}

export async function LogMessage (message) {
    let miscstr = message.content
    for (const obj of message.attachments) {
        miscstr += ` (file: ${obj[1].name})`
    }
    log("Message", false, message.author, miscstr)
}

export async function LogButton (interaction) {
    log("Button", false, interaction.user, interaction.customId)
}