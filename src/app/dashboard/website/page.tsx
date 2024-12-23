"use client";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WordpressClient } from "@/components/website-table/client";

import V2WordpressService from "@/service/Wordpress";
import { WordPressSitesResponse } from "@/types/ApiRespose";
import { useEffect } from "react";


const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "User", link: "/dashboard/user" },
];
export default function page() {

  // useEffect(() => {
  //   V2WordpressService.getwordpresssite().then((data: WordPressSitesResponse) => {
  //   }).catch(() => {
  //     console.log("error");
  //   })
  // }, [])
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <WordpressClient  />
      </div>
    </>
  );
}
