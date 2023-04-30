"use strict";
module.exports = {
    memeRegexp: /(?:http|https):\/\/(?:.*)\.memedroid\.com(?:\/memes\/detail\/|\/share-meme\/)([^\D]+)(?:[^\s]+|)/,
    memeRegexpStrict: /^(?:http|https):\/\/(?:.*)\.memedroid\.com(?:\/memes\/detail\/|\/share-meme\/)([^\D]+)(?:[^\s]+|)(?:\n(?:Compartida con Memedroid|Shared with Memedroid)|$)/,
    userRegexp: /(?:http|https):\/\/.*\.memedroid\.com\/(?:user\/view\/|user\/)([^(\s|/)]+)(?:\/profile|\/|)/,
    userRegexpStrict: /^(?:http|https):\/\/.*\.memedroid\.com\/(?:user\/view\/|user\/)([^(\s|/)]+)(?:\/profile|\/|)$/,
    idRegexp: /\d+/,
};