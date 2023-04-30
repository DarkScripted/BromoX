// Poorly made cooldown as i couldn't find one that did exactly what I wanted
"use strict";
const talkedRecently = new Object();
const msgLimit = 3
const cdTime = 5e3

module.exports = {
    "cdInterval": 5e3,
    "cooldown": cooldown,
    "cooldownGC": cooldownGC,
    "cdLog": log,
}

function cooldown(userid) {
    // returns true if user haves down sindrome
    if (!(userid in talkedRecently)) {
        talkedRecently[userid] = { "interaction": 0, "muted": null }
    }
    talkedRecently[userid].interaction += 1
    if (talkedRecently[userid].interaction > msgLimit) {
        talkedRecently[userid].muted = Date.now() + cdTime
    }

    if (talkedRecently[userid].muted) return true;
    return false;
}

async function cooldownGC() {
    for (const id in talkedRecently) {
        if (!talkedRecently[id].muted || talkedRecently[id].muted < Date.now()) {
            delete talkedRecently[id];   // removes the user from the array
        }
    }
}

async function log(){
    console.log(talkedRecently)
}
