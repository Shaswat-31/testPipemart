"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import V2PostService from "@/service/Post";
import { Post, PostsResponse } from "@/types/Post";
import { useEffect, useState } from "react";
import { columns } from "./columns";

export const PostClient = () => {
  const [post, setCity] = useState<Post[]>([]);

useEffect(() => {
    V2PostService.getPost().then((data: PostsResponse) => {
      setCity(data)
    }).catch(() => {
      console.log("error");
    })
  }, [])

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Post (${post.length})`}
          description="All posts"
        />
        {/* <AddCity setCity={setCity} id={ID} /> */}
      </div>
      <Separator />
      <DataTable searchKey="slug" columns={columns!} data={post} />
    </>
  );
};
