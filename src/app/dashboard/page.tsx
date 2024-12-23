"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PostClient } from "@/components/posts/client";


const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Post", link: "/dashboard/post" },
];

export default function page() {
    return (
        <>
            <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
                <Breadcrumbs items={breadcrumbItems} />
                <PostClient />
            </div>
        </>
    );
}
