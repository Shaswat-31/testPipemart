"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IoMdArrowRoundBack } from "react-icons/io";
interface Item {
  title: string;
  titleDescription: string;
  topDescription: string;
  specification: {
    [key: string]: string[];
  };
  chemicalSpec: {
    [key: string]: string[];
  };
  mechanicalSpec: {
    [key: string]: string[];
  };
  images: {
    [key: string]: string[];
  };
}

function ItemView() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/product/fetch/id/?id=${id}`);
        const itemData: Item = await response.json();
        setItem(itemData);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!item) {
    return <div className="container mx-auto py-10">Item not found.</div>;
  }

  // Helper function to render specifications in a transposed table
  const renderSpecsTable = (specs: { [key: string]: string[] }) => {
    const keys = Object.keys(specs);
    const numColumns = Math.max(...Object.values(specs).map(arr => arr.length));

    // Construct rows where each row starts with a key, followed by its values
    const rows = keys.map((key, rowIndex) => [
      <td key={`${key}-header`} className="p-3 border-b border-gray-300 font-semibold">
        {key}
      </td>,
      ...Array.from({ length: numColumns }, (_, colIndex) => (
        <td key={`${key}-${colIndex}`} className="p-3 border-b border-gray-300">
          {specs[key][colIndex] || ""}
        </td>
      )),
    ]);

    return (
      <div className="overflow-x-auto rounded-md shadow w-full">
        <table className="w-full text-left border-collapse">
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} >
                {row}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 px-6 w-full">
      <a href="/dashboard/material" className="text-blue-600 hover:underline mb-6 block text-lg">
      <IoMdArrowRoundBack />
      </a>
      <ScrollArea className="h-[calc(100vh-180px)] rounded-md border w-full">
      <h1 className="text-3xl font-bold mb-3">{item.title}</h1>
      <p className="text-lg text-gray-500 mb-2">{item.titleDescription}</p>
      <p className="text-base text-gray-400 mb-8">{item.topDescription}</p>

      <div className="space-y-10 max-h-[400px]">
        {/* Specifications */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
          {renderSpecsTable(item.specification)}
        </div>

        {/* Chemical Specifications */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Chemical Specifications</h2>
          {renderSpecsTable(item.chemicalSpec)}
        </div>

        {/* Mechanical Specifications */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Mechanical Specifications</h2>
          {renderSpecsTable(item.mechanicalSpec)}
        </div>

        {/* <div>
        {
          item.images?.map((img) => <img src={img} alt="Product" />)
        }
        </div> */}
      </div>
      </ScrollArea>
    </div>
  );
}

export default ItemView;
