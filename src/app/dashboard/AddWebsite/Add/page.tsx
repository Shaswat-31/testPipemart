"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
interface FormData {
  post_id: number;
  new_post_name: string;
  new_post_title: string;
  product: string;
  city: string;
  country: string;
  title_description?: string;
  top_description?: string;
}

type SpecType = {
  [key: string]: string[];
};
type Template = {
  id: string;
  post_id: number;
  post_name: string;
  url: string;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState("");

  const [specifications, setSpecifications] = useState<SpecType>({
    specRow1: ["", ""],
  });
  const [chemicals, setChemicals] = useState<SpecType>({
    chemRow1: ["", ""],
  });
  const [mechanicals, setMechanicals] = useState<SpecType>({
    mechRow1: ["", ""],
  });
  const [templates, setTemplates] = useState<Template[]>([]);
  const totalSteps = 5;
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const [dialogOpen, setDialogOpen] = useState(true);

  const addSpecificationRow = () => {
    const newRowId = `specRow${Object.keys(specifications).length + 1}`;
    setSpecifications({ ...specifications, [newRowId]: ["", ""] });
  };

  const addChemicalRow = () => {
    const newRowId = `chemRow${Object.keys(chemicals).length + 1}`;
    setChemicals({ ...chemicals, [newRowId]: ["", ""] });
  };

  const addMechanicalRow = () => {
    const newRowId = `mechRow${Object.keys(mechanicals).length + 1}`;
    setMechanicals({ ...mechanicals, [newRowId]: ["", ""] });
  };

  const addSpecificationColumn = (rowId: string) => {
    setSpecifications({
      ...specifications,
      [rowId]: [...specifications[rowId], ""],
    });
  };

  const addChemicalColumn = (rowId: string) => {
    setChemicals({
      ...chemicals,
      [rowId]: [...chemicals[rowId], ""],
    });
  };

  const addMechanicalColumn = (rowId: string) => {
    setMechanicals({
      ...mechanicals,
      [rowId]: [...mechanicals[rowId], ""],
    });
  };
  const [wordpress, setWordpress] = useState<any>(false);
  const website = useSelector((state: RootState) => state.wordpress)

  useEffect(()=>{
    setWordpress(website)
  },[website])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/temp/fetch"); // Adjust API route as needed
        setTemplates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Error",
          description: "Failed to fetch templates.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
  
    // Construct the dynamic specification, chemical, and mechanical data
    const formattedSpecifications = Object.entries(specifications).map(
      ([rowId, columns]) => columns
    );
  
    const formattedChemicals = Object.entries(chemicals).map(
      ([rowId, columns]) => columns
    );
  
    const formattedMechanicals = Object.entries(mechanicals).map(
      ([rowId, columns]) => columns
    );
    console.log(wordpress);
    console.log(formattedSpecifications)
    const advantageJson={
      "prompt": `Write the advantages of ${data.product} pipes total 5 in numbers using only <ol><li> tags and bold tags for specific points and make sure the length is less than 1000`,
      "type": {
        "file": "text",
        "name": "advantages"
      }
    }
    const applicationJson={
      "prompt": `Write the application of ${data.product} pipes in industries in total of n number of points using only <ol><li> tags and bold tags for specific points`,
      "type": {
        "file": "text",
        "name": "applications"
      }
    }
    
    const advantage=await axios.post("/api/generate",advantageJson)
    const application=await axios.post("/api/generate",applicationJson)
    // Construct the JSON payload
    const jsonPayload = {
      original_post_id: data.post_id,
      new_post_name: data.new_post_name,
      new_post_title: data.new_post_title,
      placeholders: {
        title: data.product,
        city: data.city,
        country: data.country,
        title_description: data.title_description || "",
        top_description: data.top_description || "",
        application:application.data.text,
        advantage: advantage.data.text
      },
      specification: formattedSpecifications,
      chemicalSpec: formattedChemicals,
      mechanicalSpec: formattedMechanicals,
      db:{
        username:wordpress.username,
        password:wordpress.password,
        host:wordpress.hostUrl,
        database:wordpress.databaseName
      }
    };
  
    try {
      console.log(jsonPayload);
      const response = await axios.post("/api/pipes", jsonPayload);
      setCreatedUrl(`https://tpm.secureclouddns.net/${data.new_post_name}`);
      setLoading(false);
    } catch (error) {

      toast({
        title: "Error submitting data",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });

      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-lg mx-auto p-6 overflow-auto">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter New Post Details</DialogTitle>
          </DialogHeader>
          <select {...register("post_id")}>
            {templates.map((template) => (
              <option key={template.id} value={template.post_id}>
                {template.post_name} (ID: {template.post_id})
              </option>
            ))}
          </select>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <h1 className="text-lg font-bold mb-4 text-center">
        {currentStep === 1
          ? "Create New Post"
          : currentStep === 2
          ? "Add Description"
          : currentStep === 3
          ? "Add Specifications"
          : currentStep === 4
          ? "Add Chemical Composition"
          : "Add Mechanical Properties"}
      </h1>


      <Progress value={(currentStep / totalSteps) * 100} className="mb-6" />

      {createdUrl ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-bold">Post created successfully!</p>
          <a href={createdUrl} className="text-blue-500">
            {createdUrl}
          </a>

        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields for "Create New Post" and "Add Description" steps */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="New Post Name"
                {...register("new_post_name")}
              />
              <Input
                placeholder="New Post Title"
                {...register("new_post_title")}
              />
              <Input placeholder="Product" {...register("product")} />
              <Input placeholder="City" {...register("city")} />
              <Input placeholder="Country" {...register("country")} />
              <Textarea
                placeholder="Title Description"
                {...register("title_description")}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <Textarea
                placeholder="Top Description"
                {...register("top_description")}
              />
            </div>
          )}

          {/* Specification Step */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold">Specifications</h2>
              {Object.entries(specifications).map(([rowId, columns], rowIndex) => (
                <div key={rowId} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {columns.map((col, colIndex) => (
                      <Input
                        key={colIndex}
                        placeholder={`Spec ${rowIndex + 1}, Col ${colIndex + 1}`}
                        value={col}
                        onChange={(e) => {
                          const updatedRow = [...columns];
                          updatedRow[colIndex] = e.target.value;
                          setSpecifications({
                            ...specifications,
                            [rowId]: updatedRow,
                          });
                        }}
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={() => addSpecificationColumn(rowId)}
                    >
                      Add Column
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addSpecificationRow}>
                Add Specification Row
              </Button>
            </div>
          )}

          {/* Chemical Composition Step */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold">Chemical Composition</h2>
              {Object.entries(chemicals).map(([rowId, columns], rowIndex) => (
                <div key={rowId} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {columns.map((col, colIndex) => (
                      <Input
                        key={colIndex}
                        placeholder={`Chem ${rowIndex + 1}, Col ${colIndex + 1}`}
                        value={col}
                        onChange={(e) => {
                          const updatedRow = [...columns];
                          updatedRow[colIndex] = e.target.value;
                          setChemicals({
                            ...chemicals,
                            [rowId]: updatedRow,
                          });
                        }}
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={() => addChemicalColumn(rowId)}
                    >
                      Add Column
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addChemicalRow}>
                Add Chemical Row
              </Button>
            </div>
          )}

          {/* Mechanical Properties Step */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-semibold">Mechanical Properties</h2>
              {Object.entries(mechanicals).map(([rowId, columns], rowIndex) => (
                <div key={rowId} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {columns.map((col, colIndex) => (
                      <Input
                        key={colIndex}
                        placeholder={`Mech ${rowIndex + 1}, Col ${colIndex + 1}`}
                        value={col}
                        onChange={(e) => {
                          const updatedRow = [...columns];
                          updatedRow[colIndex] = e.target.value;
                          setMechanicals({
                            ...mechanicals,
                            [rowId]: updatedRow,
                          });
                        }}
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={() => addMechanicalColumn(rowId)}
                    >
                      Add Column
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addMechanicalRow}>
                Add Mechanical Row
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full mt-4" disabled={loading || currentStep!==5}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
          disabled={currentStep === totalSteps}
        >
          Next
        </Button>
      </div>

    </div>
  );
}
