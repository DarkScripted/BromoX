
"use strict";
module.exports = {
	unix2time,
    sleep,
};

function unix2time(timestamp) {
    let date = new Date(timestamp*1e3)
    return date.toLocaleString("es-ES").toString()
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }