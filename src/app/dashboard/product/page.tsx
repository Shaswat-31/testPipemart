"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast"; // Ensure toast is configured

interface Product {
  id: string;
  name: string;
}

function Page() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Track product for deletion
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dlt,setDlt]=useState(false);
  const router = useRouter();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/category/fetch");
        setData(response.data); // Assuming the API returns an array of products
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setDlt(true);
    try {
      await axios.post("/api/category/delete", { id: selectedProduct.id });
      setData((prev) => prev.filter((product) => product.id !== selectedProduct.id));
      setDialogOpen(false);
      toast({
        title: "Success",
        description: `${selectedProduct.name} has been deleted.`,
      });
      setDlt(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
      setDlt(false);
      setDialogOpen(false);
    }
  };

  const filteredData = data.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        loading....
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p className="font-semibold text-lg">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Categories</h1>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/product/add")}
          className="bg-primary hover:bg-primary-dark"
        >
          + Add Product
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((product) => (
            <Card
              key={product.id}
              className="shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>Product ID: {product.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  className="max-w-sm"
                  onClick={() => {
                    setSelectedProduct(product);
                    setDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
                <a href={`/dashboard/product/${product.name.replace(" ", "-")}`}>
                <Button>View</Button>
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found matching your search.
          </p>
        )}
      </div>

      {/* Dialog for Deletion Confirmation */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedProduct?.name}?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!selectedProduct}
            >
              {!dlt? "Delete" : "Deleting..."}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Page;
