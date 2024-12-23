"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast"; // Ensure you have toast setup in your project

function AddProductPage() {
  const [productName, setProductName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleAddProduct = async () => {
    if (!productName.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/category/insert", { title: productName.trim() });
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
      setProductName(""); // Reset the form
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Add Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-8 py-4">
          {/* Product Name Input */}
          <div className="space-y-4">
            <Label htmlFor="product-name" className="text-lg font-medium">Product Name</Label>
            <Input
              id="product-name"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={loading}
              className="h-12 text-lg"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between px-8 py-4">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/product")}
            disabled={loading}
            className="h-12 w-32 text-lg"
          >
            Back
          </Button>
          {/* Submit Button */}
          <Button onClick={handleAddProduct} disabled={loading} className="h-12 w-32 text-lg bg-primary">
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AddProductPage;
