"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
// Define the structure of the data returned by the API
interface GradeLinks {
  [subKey: string]: string; // e.g., { "Grade A": "https://example.com/grade-a" }
}

interface GradesData {
  [category: string]: {
    links: GradeLinks;
  };
}

function Page() {
  const params = useParams();
  const name: string = Array.isArray(params.name) ? params.name[0] : params.name || "";

  const [filteredData, setFilteredData] = useState<GradesData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGrades() {
      try {
        setLoading(true);
        const response = await axios.post<GradesData>("/api/gradeProduct/jsonName", { name });
        setFilteredData(response.data); // Set the fetched data
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError("Failed to fetch grades data.");
      } finally {
        setLoading(false);
      }
    }

    fetchGrades();
  }, [name]); // Refetch when the `name` changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="max-h-h-[calc(100vh-200px)]"> 
        <CardHeader>
        <CardTitle className="p-2 border-b border-gray-200">
  <div className="flex justify-start items-center gap-4 space-y-2">
    <a href="/dashboard/product" className="text-blue-500 hover:underline text-md">
    <IoMdArrowRoundBack />
    </a>
    <h1 className="text-2xl font-bold">All Grades</h1>
  </div>
</CardTitle>

        </CardHeader>
        <CardContent>
          {Object.keys(filteredData).length === 0 ? (
            <div className="text-center text-gray-600 py-6">
              No grades found matching <Badge variant="outline">{name}</Badge>
            </div>
          ) : (
            <ScrollArea className="h-[calc(80vh-10px)] border rounded-lg p-4 overflow-y-auto">
              {Object.entries(filteredData).map(([key, value]) => (
                <div key={key} className="mb-8">
                  {/* Category Header */}
                  <h2 className="text-xl font-semibold text-blue-700 mb-3">{key}</h2>
                  <Separator />
                  {/* Links */}
                  <ul className="pl-5 mt-3 space-y-2">
                    {Object.entries(value.links).map(([subKey, subLink]) => (
                      <li key={subKey}>
                          {subKey}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
