"use strict";
/* Muhamad Ristiyanto _ https://github.com/Gimenz
 * Created, Published at Selasa, 9 Maret 2021
 * Modified, Updated at Rabu, 8 Desember 2021
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.igApi = void 0;
const utils_1 = require("./utils");
const RequestHandler_1 = require("./helper/RequestHandler");
const CookieHandler_1 = require("./helper/CookieHandler");
const query_1 = require("./helper/query");
const cookie = new CookieHandler_1.CookieHandler();
class igApi {
    constructor(session_id = '') {
        this.session_id = session_id;
        this.setCookie(this.session_id);
    }
    /**
     * Set session id for most all IG Request
     * @param {session_id} session_id
     */
    setCookie(session_id = this.session_id) {
        try {
            if (!cookie.check()) {
                cookie.save(session_id);
            }
            else {
                cookie.update(session_id);
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    /**
     * get user id by username
     * @param {username} username
     * @returns
     */
    getIdByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield RequestHandler_1.IGFetch.get(`/${username}/?__a=1`);
                return data.graphql.user.id;
            }
            catch (error) {
                if (error.response.status == 404) {
                    throw new Error('Post Not Found');
                }
                else if (error.response.status == 403) {
                    throw new Error('Forbidden, try set cookie first');
                }
                else if (error.response.status == 401) {
                    throw new Error('Unauthorized, try set cookie first');
                }
                else if (error.request) {
                    throw new Error(error.request);
                }
                else {
                    throw new Error(error.message);
                }
            }
        });
    }
    /**
     * format metadata
     * @param {Graphql} metadata
     * @returns
     */
    formatSidecar(metadata) {
        const graphql = metadata.shortcode_media;
        let links = [];
        if (graphql.__typename == 'GraphSidecar') {
            graphql.edge_sidecar_to_children.edges.forEach(doc => {
                let obj = {};
                obj.type = doc.node.is_video ? 'video' : 'image';
                obj.url = doc.node.is_video ? doc.node.video_url : doc.node.display_url;
                obj.dimensions = doc.node.dimensions;
                links.push(obj);
            });
        }
        else if (graphql.__typename == 'GraphVideo') {
            let obj = {};
            obj.type = graphql.is_video ? 'video' : 'image';
            obj.url = graphql.is_video ? graphql.video_url : graphql.display_url;
            obj.dimensions = graphql.dimensions;
            links.push(obj);
        }
        else if (graphql.__typename == 'GraphImage') {
            let obj = {};
            obj.type = graphql.is_video ? 'video' : 'image';
            obj.url = graphql.is_video ? graphql.video_url : graphql.display_url;
            obj.dimensions = graphql.dimensions;
            links.push(obj);
        }
        return links;
    }
    /**
     * fetch instagram post by url
     * @param {url} url url of instagram post, you can get metadata from private profile if you use session id \w your account that follows target account
     * @returns {Promise<IGPostMetadata>}
     */
    fetchPost(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = (0, utils_1.shortcodeFormatter)(url);
                const graphql = (yield RequestHandler_1.IGFetch.get(`/${post.type}/${post.shortcode}/?__a=1`))
                    .data.graphql;
                const metaData = graphql.shortcode_media;
                return {
                    username: metaData.owner.username,
                    name: metaData.owner.full_name,
                    media_id: metaData.id,
                    shortcode: metaData.shortcode,
                    taken_at_timestamp: metaData.taken_at_timestamp,
                    likes: metaData.edge_media_preview_like.count,
                    caption: metaData.edge_media_to_caption.edges.length >= 1
                        ? metaData.edge_media_to_caption.edges[0].node.text
                        : '',
                    media_count: metaData.__typename == 'GraphSidecar'
                        ? metaData.edge_sidecar_to_children.edges.length
                        : 1,
                    comment_count: metaData.edge_media_to_parent_comment.count,
                    links: this.formatSidecar(graphql),
                };
            }
            catch (error) {
                if (error.response.status == 404) {
                    throw new Error('Post Not Found');
                }
                else if (error.response.status == 403) {
                    throw new Error('Forbidden, try set cookie first');
                }
                else if (error.response.status == 401) {
                    throw new Error('Unauthorized, try set cookie first');
                }
                else if (error.request) {
                    throw new Error(error.request);
                }
                else {
                    throw new Error(error.message);
                }
            }
        });
    }
    /**
     * fetch profile by username
     * @param {String} username
     * @returns {Promise<IGUserMetadata>}
     */
    fetchUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userID = yield this.getIdByUsername(username);
                const { data } = yield RequestHandler_1.IGUser.get(`/${userID}/info/`);
                const graphql = data;
                const isSet = typeof graphql.user.full_name !== 'undefined';
                if (!cookie.check())
                    throw new Error('set cookie first to use this function');
                if (!isSet && cookie.check())
                    throw new Error('Invalid cookie, pls update with new cookie');
                return {
                    id: graphql.user.pk,
                    username: graphql.user.username,
                    fullname: graphql.user.full_name,
                    followers: graphql.user.follower_count,
                    following: graphql.user.following_count,
                    post_count: graphql.user.media_count,
                    is_private: graphql.user.is_private,
                    is_verified: graphql.user.is_verified,
                    biography: graphql.user.biography,
                    external_url: graphql.user.external_url,
                    total_igtv_videos: graphql.user.total_igtv_videos,
                    has_videos: graphql.user.has_videos,
                    hd_profile_pic_url_info: graphql.user.hd_profile_pic_url_info,
                    has_highlight_reels: graphql.user.has_highlight_reels,
                    has_guides: graphql.user.has_guides,
                    is_business: graphql.user.is_business,
                    contact_phone_number: graphql.user.contact_phone_number,
                    public_email: graphql.user.public_email,
                    account_type: graphql.user.account_type,
                };
            }
            catch (error) {
                if (error.response) {
                    throw new Error(error.response);
                }
                else if (error.request) {
                    throw new Error(error.request);
                }
                else {
                    throw new Error(error.message);
                }
            }
        });
    }
    /**
     *
     * @param {StoriesGraphQL} metadata
     * @returns {ItemStories[]}
     */
    parseStories(metadata) {
        const items = metadata.items;
        let storyList = new Array();
        for (let i = 0; i < items.length; i++) {
            if (items[i].media_type == 1) {
                storyList.push({
                    type: 'image',
                    mimetype: 'image/jpeg',
                    url: items[i].image_versions2.candidates[0].url,
                    taken_at: items[i].taken_at,
                    expiring_at: items[i].expiring_at,
                    id: items[i].id,
                    original_width: items[i].original_width,
                    original_height: items[i].original_height,
                    has_audio: items[i].has_audio !== undefined ? items[i].has_audio : null,
                    video_duration: items[i].video_duration !== undefined
                        ? items[i].video_duration
                        : null,
                    caption: items[i].caption,
                });
            }
            else {
                storyList.push({
                    type: 'video',
                    mimetype: 'video/mp4',
                    url: items[i].video_versions[0].url,
                    taken_at: items[i].taken_at,
                    expiring_at: items[i].expiring_at,
                    id: items[i].id,
                    original_width: items[i].original_width,
                    original_height: items[i].original_height,
                    has_audio: items[i].has_audio !== undefined ? items[i].has_audio : false,
                    video_duration: items[i].video_duration !== undefined
                        ? items[i].video_duration
                        : null,
                    caption: items[i].caption,
                });
            }
        }
        return storyList;
    }
    /**
     * fetches stories metadata (THIS FUNCTION REQUIRES SESSION ID)
     * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
     * @returns
     */
    fetchStories(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userID = yield this.getIdByUsername(username);
                const { data } = yield RequestHandler_1.IGStories.get(`/${userID}/reel_media/`);
                const graphql = data;
                const isFollowing = typeof graphql.user.friendship_status !== 'undefined';
                if (!isFollowing && graphql.user.is_private)
                    throw new Error('Private profile');
                if (graphql.items.length == 0)
                    throw new Error('Stories not available');
                return {
                    username: graphql.user.username,
                    stories_count: graphql.media_count,
                    stories: this.parseStories(graphql),
                };
            }
            catch (error) {
                if (error.response.status !== 200) {
                    throw new Error('Invalid Cookie');
                }
                else if (error.response) {
                    throw new Error(error.response.data);
                }
                else if (error.request) {
                    throw new Error(error.request);
                }
                else {
                    throw new Error(error.message);
                }
            }
        });
    }
    /**
     * Fetch all reels/highlight id
     * @param {username} username
     * @returns
     */
    getReelsIds(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = yield this.getIdByUsername(username);
            const { data } = yield RequestHandler_1.IGHighlight.get('', {
                params: (0, query_1.highlight_ids_query)(userID)
            });
            const graphql = data;
            let items = new Array();
            graphql.data.user.edge_highlight_reels.edges.map((edge) => {
                items.push({
                    highlight_id: edge.node.id,
                    cover: edge.node.cover_media.thumbnail_src,
                    title: edge.node.title
                });
            });
            return items;
        });
    }
    /**
     * get media urls from highlight id
     * @param {ids} id of highlight
     * @returns
     */
    getReels(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield RequestHandler_1.IGHighlight.get('', { params: (0, query_1.highlight_media_query)(ids) });
            const graphql = data;
            let result = graphql.data.reels_media[0].items.map((item) => ({
                media_id: item.id,
                mimetype: item.is_video ? 'video/mp4' || 'video/gif' : 'image/jpeg',
                taken_at: item.taken_at_timestamp,
                type: item.is_video ? 'video' : 'image',
                url: item.is_video ? item.video_resources[0].src : item.display_url,
                dimensions: item.dimensions
            }));
            return result;
        });
    }
    /**
     * fetches highlight metadata (REQUIRES SESSION ID)
     * @param {string} username username target to fetch the highlights, also work with private profile if you use session id \w your account that follows target account
     * @returns
     */
    fetchHighlights(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ids = yield this.getReelsIds(username);
                const reels = yield Promise.all(ids.map(x => this.getReels(x.highlight_id)));
                let data = [];
                for (let i = 0; i < reels.length; i++) {
                    data.push({
                        title: ids[i].title,
                        cover: ids[i].cover,
                        media_count: reels[i].length,
                        highlights_id: ids[i].highlight_id,
                        highlights: reels[i]
                    });
                }
                let json = {
                    username,
                    highlights_count: ids.length,
                    data: data
                };
                return json;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.igApi = igApi;
