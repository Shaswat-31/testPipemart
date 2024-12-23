"use client";

import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { useQuery } from "react-query";
import V2WordpressService from "@/service/Wordpress";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSiteData } from "@/store/wordpressSlice";
import { WordPressSite } from "@/types/ApiRespose";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Header() {
  const dispatch = useDispatch();

  // Fetch WordPress sites
  const { data: wordpressSites = [], isLoading, isError } = useQuery({
    queryKey: ["wordpressSites"],
    queryFn: V2WordpressService.getwordpresssite,
  });

  // Fetch current WordPress site from Redux
  const website = useSelector((state: RootState) => state.wordpress);

  // State to manage current WordPress site
  const [wordpress, setWordpress] = useState<any>(false);

  useEffect(() => {
    setWordpress(website);
  }, [website]);

  // Handle site selection
  const handleSiteChange = (siteId: string) => {
    const selectedSite = wordpressSites.find((site: WordPressSite) => site.id === siteId);
    if (selectedSite) {
      // Update Redux state
      dispatch(
        setSiteData({
          country: selectedSite.country,
          language: selectedSite.language,
          url: selectedSite.url,
          slug: selectedSite.slug,
          hostUrl: selectedSite.hostUrl,
          databaseName: selectedSite.databaseName,
          wordpress_id: selectedSite.id,
          username: selectedSite.username,
          password: selectedSite.password,
          wpuser: selectedSite.wpuser,
          wppass: selectedSite.wppass,
          temp_id:selectedSite.temp_id,
          industry:selectedSite.industry,
          table_prefix:selectedSite.table_prefix
        })
      );
    }
  };

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={'/'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </Link>
        </div>

        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div>Loading sites...</div>
          ) : isError ? (
            <div>Error fetching sites</div>
          ) : (
            <Select
              onValueChange={handleSiteChange}
              value={wordpress?.wordpress_id || ""}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent>
                {wordpressSites.map((site: WordPressSite) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
