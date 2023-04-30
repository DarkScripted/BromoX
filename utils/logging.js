
module.exports = {
    LogCommand,
    LogMessage,
    LogButton
}

function Log (type, denied, author, content) {
    console.log(`[${type}] ${author.username}#${author.discriminator}|${author.id}> ${content}`)
}

function LogCommand (interaction){
    let finalstr = "";
    for (const opt of interaction.options.data){
        finalstr += `(${opt.name}: ${opt.value})`
    }
    Log("Command Execute", false, interaction.user, finalstr)
}

function LogMessage (message) {
    let miscstr = message.content
    for (const obj of message.attachments) {
        miscstr += ` (file: ${obj[1].name})`
    }
    Log("Message", false, message.author, miscstr)
}

function LogButton (interaction) {
    Log("Button", false, interaction.user, interaction.customId)
}