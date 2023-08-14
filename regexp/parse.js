"use strict";

export const memeRegexp = /(?:http|https):\/\/(?:.*)\.memedroid\.com(?:\/memes\/detail\/|\/share-meme\/)([^\D]+)(?:[^\s]+|)/;
export const memeRegexpStrict = /^(?:http|https):\/\/(?:.*)\.memedroid\.com(?:\/memes\/detail\/|\/share-meme\/)([^\D]+)(?:[^\s]+|)(?:\n(?:Compartida con Memedroid|Shared with Memedroid)|$)/;
export const userRegexp = /(?:http|https):\/\/.*\.memedroid\.com\/(?:user\/view\/|user\/)([^(\s|/)]+)(?:\/profile|\/|)/;
export const userRegexpStrict = /^(?:http|https):\/\/.*\.memedroid\.com\/(?:user\/view\/|user\/)([^(\s|/)]+)(?:\/profile|\/|)$/;
export const idRegexp = /\d+/;