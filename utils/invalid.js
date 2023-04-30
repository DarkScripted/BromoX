"use strict";

module.exports = {
	invalidUsername,
	invalidMeme,
};

function invalidUsername(username) {
    return !username || username.length < 1 || username.length > 40
}


function invalidMeme(memeid) {
	return !memeid || memeid < 100 || memeid > 5e6
}