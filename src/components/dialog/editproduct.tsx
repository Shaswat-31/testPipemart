"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { putSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "../ui/use-toast";
import { Product, ProductResponse } from "@/types/ApiRespose";
import V2ProductService from "@/service/Product";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

interface Props {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    data: Product;
}

export default function EditProduct({ data, isOpen, setIsOpen }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof putSchema>>({
        resolver: zodResolver(putSchema),
        defaultValues: {
            category: data.category || "",
            description: data.description || "",
            price: data.price || 0,
            productName: data.productName || "",
        }
    });
    
    const  {data: session} = useSession();
    const  wordpress_id= session?.selectsite.wordpress_id;
    const mutation = useMutation({
        mutationFn: async (formdata: z.infer<typeof putSchema>) => {
          return await V2ProductService.updateProduct({ ...formdata, productid: data.id });
        },
        onMutate: async (newData: z.infer<typeof putSchema>) => {
            
            // Cancel outgoing queries
            await queryClient.cancelQueries(['products', wordpress_id]);
          
            // Snapshot the previous data
            const previousProducts = queryClient.getQueryData<Product[]>(['products', wordpress_id]);
            
                // console.log("new data", product.id == data.id );
            console.log(previousProducts);
            
            // Optimistically update the product in the cache
            queryClient.setQueryData<Product[]>(['products', wordpress_id], old => {
                return old?.map(product => {
                  console.log('Product ID:', product.id); // Log the product ID
                  console.log('Data ID:', data.id);       // Log the data ID for comparison
              
                  return product.id === data.id 
                    ? { ...product, ...newData } // Update the product if the ID matches
                    : product;                   // Otherwise, return the product as is
                }) ?? [];
              });
            // Return the previous state to roll back on error
            return { previousProducts };
          },
      
        onSuccess: (resData: ProductResponse) => {
          if (resData.success) {
            toast({
              title: "Product updated successfully",
              description: resData.message,
              variant: "default",
            });
            setIsOpen(false);
            // Invalidate the query to refetch updated data
            queryClient.invalidateQueries(['products', wordpress_id]);
          } else {
            toast({
              title: "Product could not be updated",
              description: resData.message,
              variant: "destructive",
            });
          }
        },
      
        // Rollback on error
        onError: (error: any, _, context: any) => {
          queryClient.setQueryData(['products', wordpress_id], context.previousProducts);
          const errorMessage = error.response?.data?.error?.message || error.message || "An error occurred";
          toast({
            title: "Error updating product",
            description: errorMessage,
            variant: "destructive",
          });
        },
      });
      
    const handleDialogChange = (open: boolean) => {
        if (!isLoading) {
            setIsOpen(open);
            if (!open) {
                form.reset();
            }
        }
    };

    async function onSubmit(formdata: z.infer<typeof putSchema>) {
        mutation.mutate(formdata);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Edit your details for the product
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="product-form" className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="productName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Product Category</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Category" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Product Price</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Product price" type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-4">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Product Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the product"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </Form>

                <DialogFooter>
                    <Button
                        type="submit"
                        size="sm"
                        form="product-form"
                        className="w-full"
                        disabled={isLoading || mutation.isLoading}
                    >
                        {isLoading || mutation.isLoading ? "Updating..." : "Update Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
