"use client";

import React, { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCities } from "./useCities";

const CityPage = () => {
  const { data: cities = [], isLoading, isError } = useCities();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const filteredData = cities.filter((city) =>
    city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-semibold">All Cities ({totalItems})</h1>
        <div className="flex gap-6">
          <a href="/dashboard/city/add">
            <Button>Add City</Button>
          </a>
          <a href="/dashboard/city/import">
            <Button>Import</Button>
          </a>
        </div>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search for a city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SN</TableHead>
              <TableHead>City Name</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load cities.</div>
      ) : (
        <>
          <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>City Name</TableHead>
                  <TableHead>Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((city, index) => (
                    <TableRow key={city.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{city.cityName}</TableCell>
                      <TableCell>{city.country}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
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
                <span key={index} className="mx-2">
                  ...
                </span>
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
        </>
      )}
    </div>
  );
};

export default CityPage;
