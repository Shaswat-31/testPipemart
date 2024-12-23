"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useMutation, useQueryClient } from "react-query";
interface CityFormData {
  cityName: string;
  postalCode: string;
  state: string;
  country: string;
}

const AddCityForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<CityFormData>();
  const queryClient = useQueryClient(); // Access React Query's query cache

  // Mutation for adding a city
  const mutation = useMutation(
    async (data: CityFormData) => {
      setLoading(true)
      const response = await fetch("/api/city/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add city");
      }
    },
    {
      onSuccess: () => {
        // Show success message
        toast({
          title: "City Added Successfully",
          description: "Your city has been added!",
          variant: "default",
        });

        // Reset form fields
        reset();

        // Invalidate the cities query to refetch updated data
        queryClient.invalidateQueries(["cities"]);
        setLoading(false)
      },
      onError: () => {
        // Show error message
        toast({
          title: "Error",
          description: "Failed to add city. Please try again.",
          variant: "destructive",
        });
        setLoading(false)
      },
    }
  );

  const onSubmit: SubmitHandler<CityFormData> = async (data) => {
    mutation.mutate(data); // Trigger the mutation
  };


  return (
    <div>
    <div className="min-h-[calc(100vh-300px)] flex justify-center items-start mt-14 w-full">
    <Card className="w-full max-w-2xl mx-auto p-6 shadow-lg rounded-md">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
        <a href="/dashboard/city"><IoMdArrowRoundBack /></a>
        Add City</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="cityName">
              City Name
            </label>
            <Input
              id="cityName"
              placeholder="Enter city name"
              {...register("cityName", { required: "City name is required" })}
              className="mt-1"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="postalCode">
              Postal Code
            </label>
            <Input
              id="postalCode"
              placeholder="Enter postal code"
              {...register("postalCode", { required: "Postal code is required" })}
              className="mt-1"
            />
          </div> */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="state">
              State
            </label>
            <Input
              id="state"
              placeholder="Enter state"
              {...register("state", { required: "State is required" })}
              className="mt-1"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="country">
              Country
            </label>
            <Input
              id="country"
              placeholder="Enter country"
              {...register("country", { required: "Country is required" })}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Submitting..." : "Add City"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
    </div>
  );
};

export default AddCityForm;
