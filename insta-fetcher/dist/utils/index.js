"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortcodeFormatter = void 0;
/**
 * format instagram long url to get shortcode
 * @param url a instagram post url
 * @returns shortcode
 */
const shortcodeFormatter = (url) => {
    // const Regex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/\w+)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?$/gi);
    // console.log(Regex.exec(url));
    // const [, shortcode] = Regex.exec(url) || '';
    // return shortcode;
    const re = new RegExp(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com(?:\/\w+)?\/(p|reel|tv)\/)([\w-]+)(?:\/)?(\?.*)?.*?$/, 'g').exec(url) || '';
    return {
        type: re[1],
        shortcode: re[2]
    };
};
exports.shortcodeFormatter = shortcodeFormatter;
