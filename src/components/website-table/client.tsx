"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import V2WordpressService from "@/service/Wordpress";
import { WordPressSite, WordPressSitesResponse } from "@/types/ApiRespose";
import { useEffect, useState } from "react";
import AddWordpressWebsite from "../dialog/addwordpresssite";
import { columns } from "./columns";

export const WordpressClient = () => {
  const [wordpressSites, setWordpressSites] = useState<WordPressSite[]>([]);

  useEffect(() => {
    V2WordpressService.getwordpresssite()

      .then((response: any) => {

        if (response && response.success) {
          setWordpressSites(response.data); // Set the WordPress sites only if success is true
        } else {
          console.error('Unexpected response format', response);
        }
      })
      .catch(() => {
        console.log("error");
      });
  }, []);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Wordpress (${wordpressSites.length})`}
          description="Manage wordpress "
        />
        <AddWordpressWebsite />
      </div>
      <Separator />
      <DataTable searchKey="slug" columns={columns} data={wordpressSites} />
    </>
  );
};
