"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { postSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "../ui/use-toast";
import V2ProductService from "@/service/Product";import { useMutation, useQueryClient } from "react-query";

import { AddProductApiResponse, Product } from "@/types/ApiRespose";

interface Props {
    wordpressId: string;
}

export default function AddProductWebsite({ wordpressId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
    });

    const mutation = useMutation({
        mutationFn: async (data: z.infer<typeof postSchema>) => {
            return await V2ProductService.addProduct({ wordpressId, ...data });
        },
        onSuccess: (resData: AddProductApiResponse) => {
            if (resData.success) {
                toast({
                    title: "Products added successfully",
                    description: resData.message,
                    variant: "default",
                });
                setIsOpen(false);
                // Invalidate queries to refetch product data
                queryClient.invalidateQueries(['products']);
            } else {
                toast({
                    title: "Products cannot be added",
                    description: resData.message,
                    variant: "destructive",
                });
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error?.message || error.message || "An error occurred";
            toast({
                title: "Products cannot be added",
                description: errorMessage,
                variant: "destructive",
            });
        },
        onSettled: () => {
            setIsLoading(false);
        }
    });

    const handleDialogChange = (open: boolean) => {
        if (!isLoading) {
            setIsOpen(open);
            if (!open) {
                form.reset();
            }
        }
    };

    const onSubmit = (data: z.infer<typeof postSchema>) => {
        setIsLoading(true);
        mutation.mutate(data);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
                    ＋ Add New Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Enter your details to add a product
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="productform"
                        className="grid gap-4 py-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="col-span-full">
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Upload Excel</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    placeholder="Select Excel file"
                                                    accept=".csv"
                                                    onChange={(e) => {
                                                        const file = e.target.files![0];
                                                        onChange(file);
                                                    }}
                                                    {...rest}
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
                        form="productform"
                        className="w-full"
                        disabled={isLoading || mutation.isLoading}
                    >
                        {isLoading || mutation.isLoading ? "Adding..." : "Add Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
