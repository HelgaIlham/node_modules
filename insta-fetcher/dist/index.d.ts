import { username, url, session_id } from './types';
import { IGPostMetadata } from './types/PostMetadata';
import { IGUserMetadata } from './types/UserMetadata';
import { IGStoriesMetadata } from './types/StoriesMetadata';
import { IHighlightsMetadata } from './types/HighlightMediaMetadata';
export declare class igApi {
    private session_id;
    constructor(session_id?: session_id);
    /**
     * Set session id for most all IG Request
     * @param {session_id} session_id
     */
    setCookie(session_id?: session_id): void;
    /**
     * get user id by username
     * @param {username} username
     * @returns
     */
    getIdByUsername(username: username): Promise<string>;
    /**
     * format metadata
     * @param {Graphql} metadata
     * @returns
     */
    private formatSidecar;
    /**
     * fetch instagram post by url
     * @param {url} url url of instagram post, you can get metadata from private profile if you use session id \w your account that follows target account
     * @returns {Promise<IGPostMetadata>}
     */
    fetchPost(url: url): Promise<IGPostMetadata>;
    /**
     * fetch profile by username
     * @param {String} username
     * @returns {Promise<IGUserMetadata>}
     */
    fetchUser(username: username): Promise<IGUserMetadata>;
    /**
     *
     * @param {StoriesGraphQL} metadata
     * @returns {ItemStories[]}
     */
    private parseStories;
    /**
     * fetches stories metadata (THIS FUNCTION REQUIRES SESSION ID)
     * @param {string} username username target to fetch the stories, also work with private profile if you use session id \w your account that follows target account
     * @returns
     */
    fetchStories(username: username): Promise<IGStoriesMetadata>;
    /**
     * Fetch all reels/highlight id
     * @param {username} username
     * @returns
     */
    private getReelsIds;
    /**
     * get media urls from highlight id
     * @param {ids} id of highlight
     * @returns
     */
    private getReels;
    /**
     * fetches highlight metadata (REQUIRES SESSION ID)
     * @param {string} username username target to fetch the highlights, also work with private profile if you use session id \w your account that follows target account
     * @returns
     */
    fetchHighlights(username: username): Promise<IHighlightsMetadata>;
}
