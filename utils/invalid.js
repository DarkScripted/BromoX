"use strict";

export function invalidUsername(username) {
    return !username || username.length < 1 || username.length > 40
}


export function invalidMeme(memeid) {
	return !memeid || memeid < 100 || memeid > 5e6
}