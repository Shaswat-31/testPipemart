export interface Post {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
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
        og_image: {
            url: string;
        }[];
        twitter_card: string;
        twitter_misc: {
            "Est. reading time": string;
        };
        schema: {
            "@context": string;
            "@graph": (WebPage | BreadcrumbList | WebSite | Organization)[];
        };
    };
    _links: {
        self: {
            href: string;
        }[];
        collection: {
            href: string;
        }[];
        about: {
            href: string;
        }[];
        author: {
            embeddable: boolean;
            href: string;
        }[];
        replies: {
            embeddable: boolean;
            href: string;
        }[];
        "version-history": {
            count: number;
            href: string;
        }[];
        "predecessor-version": {
            id: number;
            href: string;
        }[];
        "wp:attachment": {
            href: string;
        }[];
        curies: {
            name: string;
            href: string;
            templated: boolean;
        }[];
    };
}

interface WebPage {
    "@type": "WebPage";
    "@id": string;
    url: string;
    name: string;
    isPartOf: {
        "@id": string;
    };
    datePublished: string;
    dateModified: string;
    description: string;
    breadcrumb: {
        "@id": string;
    };
    inLanguage: string;
    potentialAction: {
        "@type": "ReadAction";
        target: string[];
    }[];
}

interface BreadcrumbList {
    "@type": "BreadcrumbList";
    "@id": string;
    itemListElement: {
        "@type": "ListItem";
        position: number;
        name: string;
        item?: string;
    }[];
}

interface WebSite {
    "@type": "WebSite";
    "@id": string;
    url: string;
    name: string;
    description: string;
    publisher: {
        "@id": string;
    };
    potentialAction: {
        "@type": "SearchAction";
        target: {
            "@type": "EntryPoint";
            urlTemplate: string;
        };
        "query-input": string;
    }[];
    inLanguage: string;
}

interface Organization {
    "@type": "Organization";
    "@id": string;
    name: string;
    url: string;
    logo: {
        "@type": "ImageObject";
        inLanguage: string;
        "@id": string;
        url: string;
        contentUrl: string;
        width: number;
        height: number;
        caption: string;
    };
    image: {
        "@id": string;
    };
}

export type PostsResponse = Post[];
