import { MediaType } from "types";
/** Instagram Simplified Highlights reels Metadata */
export interface IHighlightsMetadata {
    /** Instagram username */
    username: string;
    /** stories count */
    highlights_count: number;
    data: IReelsMetadata[];
}
export interface IReelsMetadata {
    title: string;
    cover: string;
    media_count: number;
    highlights_id: string;
    highlights: ReelsMediaData[];
}
export interface ReelsMediaData {
    media_id: string;
    mimetype: string;
    taken_at: number;
    /** @type MediaType */
    type: MediaType;
    /** Downloadable media url */
    url: string;
    dimensions: Dimensions;
}
export interface HMedia {
    data: Data;
    status: string;
}
export interface Data {
    reels_media: ReelsMedia[];
}
export interface ReelsMedia {
    __typename: string;
    id: string;
    latest_reel_media: null;
    can_reply: boolean;
    owner: Owner;
    items: Item[];
}
export interface Item {
    audience: string;
    edge_story_media_viewers: EdgeStoryMediaViewers;
    __typename: string;
    id: string;
    dimensions: Dimensions;
    display_resources: DisplayResource[];
    display_url: string;
    media_preview: null | string;
    gating_info: null;
    fact_check_overall_rating: null;
    fact_check_information: null;
    sensitivity_friction_info: null;
    taken_at_timestamp: number;
    expiring_at_timestamp: number;
    story_cta_url: null;
    story_view_count: null;
    is_video: boolean;
    owner: Owner;
    tracking_token: string;
    tappable_objects: any[];
    story_app_attribution: null;
    edge_media_to_sponsor_user: EdgeMediaToSponsorUser;
    muting_info: null;
    has_audio?: boolean;
    overlay_image_resources?: null;
    video_duration?: number;
    video_resources: VideoResource[];
}
export interface Dimensions {
    height: number;
    width: number;
}
export interface DisplayResource {
    src: string;
    config_width: number;
    config_height: number;
}
export interface EdgeMediaToSponsorUser {
    edges: any[];
}
export interface EdgeStoryMediaViewers {
    count: number;
    page_info: PageInfo;
    edges: any[];
}
export interface PageInfo {
    has_next_page: boolean;
    end_cursor: null;
}
export interface Owner {
    id: string;
    profile_pic_url: string;
    username: string;
    followed_by_viewer: boolean;
    requested_by_viewer: boolean;
    __typename?: string;
}
export interface VideoResource {
    src: string;
    config_width: number;
    config_height: number;
    mime_type: string;
    profile: string;
}
