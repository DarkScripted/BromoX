// Poorly made cooldown as i couldn't find one that did exactly what I wanted
"use strict";

export const talkedRecently = new Object();
export const msgLimit = 3
export const cdTime = 5e3
export const cdInterval = 5e3

export function cooldown(userid) {
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

export async function cooldownGC() {
    for (const id in talkedRecently) {
        if (!talkedRecently[id].muted || talkedRecently[id].muted < Date.now()) {
            delete talkedRecently[id];   // removes the user from the array
        }
    }
}

export async function cdLog() {
    console.log(talkedRecently)
}
