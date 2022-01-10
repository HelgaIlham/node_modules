"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGSearch = exports.IGHighlight = exports.IGStories = exports.IGUser = exports.IGFetch = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const CookieHandler_1 = require("./CookieHandler");
const session_id = new CookieHandler_1.CookieHandler().get();
const headers = {
    'cache-control': 'no-cache',
    'user-agent': config_1.config.android,
    cookie: `sessionid=${session_id};`,
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6,ru;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    pragma: 'no-cache',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
};
/** Fetches Using Instagram Base Url */
exports.IGFetch = axios_1.default.create({
    baseURL: config_1.config.instagram_base_url,
    headers,
});
/** Fetches Instagram User */
exports.IGUser = axios_1.default.create({
    baseURL: config_1.config.instagram_user_url,
    headers,
});
/** Fetches Instagram Stories */
exports.IGStories = axios_1.default.create({
    baseURL: config_1.config.instagram_stories_url,
    headers,
});
exports.IGHighlight = axios_1.default.create({
    baseURL: config_1.config.instagram_graphql,
    headers
});
/** Fetches Instagram Search Users | Places | Hashtags*/
exports.IGSearch = axios_1.default.create({
    baseURL: config_1.config.instagram_search_url,
    headers,
});
