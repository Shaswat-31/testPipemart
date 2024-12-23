"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
// Define TypeScript type for Site
interface Site {
  id: string;
  post_id: number;
  post_name: string;
  url: string;
}

function Page() {
  const [data, setData] = useState<Site[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Define how many items to show per page
  const [wordpress, setWordpress] = useState<any>(false);
  const website = useSelector((state: RootState) => state.wordpress)
  useEffect(()=>{
    setWordpress(website)
  },[website])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/temp/fetch?wordpressId=${website.wordpress_id}`);
        const sites: Site[] = await response.json();
        setData(sites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wordpress]);

  // Pagination logic
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All templates ({totalItems})</h1>
        <a href="/addTemplate">
          <Button>Add</Button>
        </a>
      </div>

      {loading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SN</TableHead>
              <TableHead>POST_ID</TableHead>
              <TableHead>Title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5) // Display 5 skeletons
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-30" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-30" /></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <>
          <ScrollArea className="h-[calc(95vh-220px)] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>POST_ID</TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((site, index) => (
                    <TableRow key={site.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{site.post_id}</TableCell>
                      <TableCell>{site.post_name}</TableCell>
                      {/* <TableCell>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {site.url}
                        </a>
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
