import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for the Page document
export interface IPage extends Document {
    id: number;
    date: Date;
    date_gmt: Date;
    guid: {
        rendered: string;
    };
    modified: Date;
    modified_gmt: Date;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    excerpt: {
        rendered: string;
        protected: boolean;
    };
    author: number;
    featured_media: number;
    parent: number;
    menu_order: number;
    comment_status: string;
    ping_status: string;
    template: string;
    meta: {
        footnotes: string;
    };
    class_list: string[];
    yoast_head: string;
    yoast_head_json: {
        title: string;
        description: string;
        robots: {
            index: string;
            follow: string;
            "max-snippet": string;
            "max-image-preview": string;
            "max-video-preview": string;
        };
        canonical: string;
        og_locale: string;
        og_type: string;
        og_title: string;
        og_description: string;
        og_url: string;
        og_site_name: string;
        article_modified_time: string;
        og_image: Array<{ url: string }>;
        twitter_card: string;
        twitter_misc: { [key: string]: string };
        schema: {
            "@context": string;
            "@graph": Array<any>;
        };
    };
    _links: {
        self: Array<{ href: string }>;
        collection: Array<{ href: string }>;
        about: Array<{ href: string }>;
        author: Array<{ embeddable: boolean; href: string }>;
        replies: Array<{ embeddable: boolean; href: string }>;
        "version-history": Array<{ count: number; href: string }>;
        "predecessor-version": Array<{ id: number; href: string }>;
        "wp:attachment": Array<{ href: string }>;
        curies: Array<{ name: string; href: string; templated: boolean }>;
    };
}

// Page Schema
const pageSchema: Schema<IPage> = new Schema({
    id: { type: Number, required: true, unique: true },
    date: { type: Date, required: true },
    date_gmt: { type: Date, required: true },
    guid: {
        rendered: { type: String, required: true }
    },
    modified: { type: Date, required: true },
    modified_gmt: { type: Date, required: true },
    slug: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    link: { type: String, required: true },
    title: {
        rendered: { type: String, required: true }
    },
    content: {
        rendered: { type: String, required: true },
        protected: { type: Boolean, required: true }
    },
    excerpt: {
        rendered: { type: String, required: true },
        protected: { type: Boolean, required: true }
    },
    author: { type: Number, required: true },
    featured_media: { type: Number, required: true },
    parent: { type: Number, required: true },
    menu_order: { type: Number, required: true },
    comment_status: { type: String, required: true },
    ping_status: { type: String, required: true },
    template: { type: String, required: true },
    meta: {
        footnotes: { type: String, required: true }
    },
    class_list: [{ type: String }],
    yoast_head: { type: String, required: true },
    yoast_head_json: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        robots: {
            index: { type: String, required: true },
            follow: { type: String, required: true },
            "max-snippet": { type: String, required: true },
            "max-image-preview": { type: String, required: true },
            "max-video-preview": { type: String, required: true }
        },
        canonical: { type: String, required: true },
        og_locale: { type: String, required: true },
        og_type: { type: String, required: true },
        og_title: { type: String, required: true },
        og_description: { type: String, required: true },
        og_url: { type: String, required: true },
        og_site_name: { type: String, required: true },
        article_modified_time: { type: String, required: true },
        og_image: [{ url: { type: String, required: true } }],
        twitter_card: { type: String, required: true },
        twitter_misc: { type: Map, of: String },
        schema: {
            "@context": { type: String, required: true },
            "@graph": [{ type: Schema.Types.Mixed }]
        }
    },
    _links: {
        self: [{ href: { type: String, required: true } }],
        collection: [{ href: { type: String, required: true } }],
        about: [{ href: { type: String, required: true } }],
        author: [{
            embeddable: { type: Boolean, required: true },
            href: { type: String, required: true }
        }],
        replies: [{
            embeddable: { type: Boolean, required: true },
            href: { type: String, required: true }
        }],
        "version-history": [{
            count: { type: Number, required: true },
            href: { type: String, required: true }
        }],
        "predecessor-version": [{
            id: { type: Number, required: true },
            href: { type: String, required: true }
        }],
        "wp:attachment": [{ href: { type: String, required: true } }],
        curies: [{
            name: { type: String, required: true },
            href: { type: String, required: true },
            templated: { type: Boolean, required: true }
        }]
    }
});

const Page: Model<IPage> = mongoose.model<IPage>("Page", pageSchema);

export default Page;