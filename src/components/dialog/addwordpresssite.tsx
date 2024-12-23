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
import { authWorpresdWebsite } from "@/schemas/worpress";
import V2WordpressService from "@/service/Wordpress";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { AuthApiResponse } from "@/types/ApiRespose";
import { toast } from "../ui/use-toast";
import { AxiosError } from "axios";

export default function AddWordpressWebsite() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof authWorpresdWebsite>>({
    resolver: zodResolver(authWorpresdWebsite), // Validates form data against the schema
    defaultValues: {
      username: "",
      password: "",
      wpuser: "",
      wppass: "",
      url: "",
      country: "", // Optional, default to an empty string
      language: "", // Optional, default to an empty string
      slug: "",
      hostUrl: "",
      databaseName: "",
      temp_id:undefined,
      industry:[],
      table_prefix:""
    },
  });
  

  const handleDialogChange = (open: boolean) => {
    if (!isLoading) {
      setIsOpen(open);
      if (!open) {
        form.reset();
        setCurrentStep(1); // Reset to step 1 on close
      }
    }
  };

  const handleVerifyStep1 = async () => {
    setIsLoading(true);
    try {
      const { username, password, hostUrl, databaseName, table_prefix } = form.getValues();
      const response = await fetch("/api/main/temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, hostUrl, databaseName, table_prefix }),
      });
      if (response.ok) {
        const data = await response.json();
        form.setValue("temp_id", data.newPostId);
        setCurrentStep(2);
        toast({ title: "Verification Successful", variant: "default" });
      } else {
        throw new Error("Invalid database credentials");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
      } else if (error instanceof AxiosError) {
        // Handle AxiosError here if needed
        toast({ title: "Verification Failed", description: error.response?.data.message || "Unknown Axios Error", variant: "destructive" });
      } else {
        toast({ title: "Verification Failed", description: "An unknown error occurred", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyStep2 = async () => {
    setIsLoading(true);
    try {
      const { wpuser, wppass, url } = form.getValues();
      console.log('wpuser:', wpuser, 'wppass:', wppass, 'url:', url); // Debugging line
  
      if (!wpuser || !wppass || !url) {
        throw new Error('WordPress credentials are incomplete');
      }
  
      const response = await fetch("/api/main/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wpuser, wppass, url }),
      });
      const data=await response.json();
      if (response.ok) {
        form.setValue("industry", data.data);
        setCurrentStep(3);
        toast({ title: "Verification Successful", variant: "default" });
      } else {
        throw new Error("Invalid WordPress credentials");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
      } else if (error instanceof AxiosError) {
        toast({
          title: "Verification Failed",
          description: error.response?.data.message || "Unknown Axios Error",
          variant: "destructive",
        });
      } else {
        toast({ title: "Verification Failed", description: "An unknown error occurred", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  async function onSubmit(data: z.infer<typeof authWorpresdWebsite>) {
    console.log("Form Data Submitted:", data);  // Log to see if the function is triggered
    setIsLoading(true);
    try {
      await V2WordpressService.addwordpressite(data);
      toast({ title: "WordPress site added", variant: "default" });
      setIsOpen(false); // Close dialog on success
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Safely access AxiosError properties
        toast({
          title: "Error",
          description: error.response?.data.message || "Failed to add site",
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        // If it's a regular Error
        toast({
          title: "Error",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
      } else {
        // Fallback for unknown errors
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
          ＋ Add New Website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add WordPress Website</DialogTitle>
          <DialogDescription>Follow the steps to add your WordPress site.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
  <form className="grid gap-4 py-4"  onSubmit={form.handleSubmit(() => {
    console.log(12);
  })}>
    {currentStep === 1 && (
      <>
        <h3 className="text-lg font-semibold">Step 1: Database Credentials</h3>
        <FormField control={form.control} name="hostUrl" render={({ field }) => (
          <FormItem>
            <FormLabel>Host URL</FormLabel>
            <FormControl><Input placeholder="Host URL" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="databaseName" render={({ field }) => (
          <FormItem>
            <FormLabel>Database Name</FormLabel>
            <FormControl><Input placeholder="Database Name" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="username" render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl><Input placeholder="Username" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" placeholder="Password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="table_prefix" render={({ field }) => (
          <FormItem>
            <FormLabel>Table_prefix</FormLabel>
            <FormControl><Input placeholder="table_prefix" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button onClick={handleVerifyStep1} disabled={isLoading} className="w-full">
          {isLoading ? "Verifying..." : "Verify Step 1"}
        </Button>
      </>
    )}

    {currentStep === 2 && (
      <>
        <h3 className="text-lg font-semibold">Step 2: WordPress Credentials</h3>
        <FormField control={form.control} name="url" render={({ field }) => (
          <FormItem>
            <FormLabel>WordPress URL</FormLabel>
            <FormControl><Input placeholder="WordPress URL" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="wpuser" render={({ field }) => (
          <FormItem>
            <FormLabel>WordPress Username</FormLabel>
            <FormControl><Input placeholder="Username" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="wppass" render={({ field }) => (
          <FormItem>
            <FormLabel>WordPress Password</FormLabel>
            <FormControl><Input type="password" placeholder="Password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button onClick={handleVerifyStep2} disabled={isLoading} className="w-full">
          {isLoading ? "Verifying..." : "Verify Step 2"}
        </Button>
      </>
    )}

    {currentStep === 3 && (
      <>
        <h3 className="text-lg font-semibold">Step 3: Submit</h3>
        <FormField control={form.control} name="slug" render={({ field }) => (
          <FormItem>
            <FormLabel>Site Name</FormLabel>
            <FormControl><Input placeholder="Site Name" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button
          onClick={()=>onSubmit(form.getValues())}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </>
    )}
  </form>
</Form>

      </DialogContent>
    </Dialog>
  );
}
