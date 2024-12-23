"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import V2ProductService from "@/service/Product";
import { RootState } from "@/store/store";
import { Product } from "@/types/ApiRespose";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import AddProductWebsite from "../dialog/addproduct";
import { CellAction } from "./cell-action";
import { columns } from "./columns";

export const ProductClient = () => {
  const data = useSelector((state: RootState) => state.wordpress);
  const ID = data.wordpress_id;

  // Define the query function
  const fetchProducts = async () => {
    const response = await V2ProductService.getProduct({
      wordpressId: ID,
    });
    return response.data!;
  };

  // Use React Query's useQuery hook
  const { data: products = [], isLoading, isError, error } = useQuery<Product[], Error>(['products', ID], fetchProducts);

  // Add the actions column here
  const actionColumn: ColumnDef<Product> = {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Actions",
  };

  // Combine the columns with the actions column
  const allcolumns: ColumnDef<Product>[] = [...columns, actionColumn];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage product"
        />
        <AddProductWebsite
          wordpressId={ID}
        // if you still need this function, ensure it is correctly implemented
          // use products instead of product
        />
      </div>
      <Separator />
      <DataTable searchKey="productName" columns={allcolumns} data={products} />
    </>
  );
};
