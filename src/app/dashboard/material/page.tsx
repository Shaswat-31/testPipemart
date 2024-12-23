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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; // Import Input component
import { ScrollArea } from "@/components/ui/scroll-area";

// Define TypeScript type for Item
interface Item {
  id: string;
  title: string;
}

function Page() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Adjust items per page as needed
  const router = useRouter();

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/product/fetch/all");
        const items: Item[] = await response.json();
        setData(items);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on the search term
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisibleButtons = 3;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3, "...");
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push("...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push("...", currentPage - 1, currentPage, currentPage + 1, "...");
      }
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Materials ({totalItems})</h1>
        {/* <div className="flex gap-6"><a href="/dashboard/material/add">
          <Button>Add Material</Button>
        </a>
        <a href="/dashboard/material/import">
          <Button>import</Button>
        </a></div> */}
      </div>

      <div className="mb-4">
        <Input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search for an item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="shadow-md rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2">SN</TableHead>
              <TableHead className="px-4 py-2">Title</TableHead>
              <TableHead className="px-4 py-2">Action</TableHead>
              {/* <TableHead className="px-4 py-2">Status</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton key={index} className="h-8 w-full rounded-md" />
                      ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id} className="border-b">
                    <TableCell className="px-4 py-2">{startIndex + index + 1}</TableCell>
                    <TableCell className="px-4 py-2">{item.title}</TableCell>
                    <TableCell className="px-4 py-2">
                      <Button
                        onClick={() => router.push(`/dashboard/material/${item.id}`)}
                        variant={"outline"}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="px-4 py-2"> {/* Add status logic here */}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No items found
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="flex justify-end mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          Previous
        </Button>
        {generatePageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              className="mx-1"
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="mx-2">...</span>
          )
        )}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Page;
