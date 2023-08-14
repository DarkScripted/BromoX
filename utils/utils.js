"use strict";

export function unix2time(timestamp) {
    let date = new Date(timestamp*1e3)
    return date.toLocaleString("es-ES").toString()
}

export function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }