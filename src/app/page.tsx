"use client";

import { Button } from "@/components/custom/button";
import AddWordpressWebsite from "@/components/dialog/addwordpresssite";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import V2WordpressService from "@/service/Wordpress";
import { setSiteData } from "@/store/wordpressSlice";
import { WordPressSite } from "@/types/ApiRespose";
import { IconBrandWordpress } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, update } = useSession();

  const {
    data: wordpressSites = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wordpressSites"],
    queryFn: V2WordpressService.getwordpresssite,
  });

  // Filtering sites based on search term
  const filteredWordpress = wordpressSites.filter((wordpress) =>
    wordpress.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const dispatch = useDispatch();

  const handleClick = async (site: WordPressSite) => {
    console.log(site);

    dispatch(
      setSiteData({
        country: " ",
        language: " ",
        url: site.url,
        slug: site.slug,
        hostUrl: site.hostUrl,
        databaseName: site.databaseName,
        wordpress_id: site.id,
        username: site.username,
        password: site.password,
        wpuser:site.wpuser,
        wppass:site.wppass,
        industry:site.industry,
        temp_id:site.temp_id,
        table_prefix:site.table_prefix
      })
    );
    if (session) {
      try {
        const result = await update({
          selectsite: {
            language: " ",
            country: " ",
            url: site.url,
            slug: site.slug,
            hostUrl: site.hostUrl,
            databaseName: site.databaseName,
            wordpress_id: site.id,
            username: site.username,
            password: site.password,
            wpuser:site.wpuser,
            wppass:site.wppass,
            industry:site.industry,
            temp_id:site.temp_id,
            table_prefix:site.table_prefix
          },
        });
        router.push("/dashboard");
      } catch (error) {
        console.error("Error updating session:", error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data.</div>;

  return (
    <div className="p-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Wordpress Websites
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a list of your apps for the integration!
        </p>
      </div>
      <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
        <div className="flex flex-col gap-4 sm:my-4 sm:flex-row justify-between w-full">
          <Input
            placeholder="Filter apps..."
            className="h-9 w-40 lg:w-[250px] px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Dialog Box */}
          <AddWordpressWebsite />
        </div>
      </div>
      <Separator className="shadow" />
      <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWordpress.map((site) => (
          <li key={site.id} className="rounded-lg border p-4 hover:shadow-md">
            <div className="mb-8 flex items-center justify-between">
              <div
                className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
              >
                <IconBrandWordpress />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleClick(site)}
              >
                Connect
              </Button>
            </div>
            <div>
              <h2 className="mb-1 font-semibold">{site.slug}</h2>
              <p className="line-clamp-2 text-gray-500">{site.country}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
