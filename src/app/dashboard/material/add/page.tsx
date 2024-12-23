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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Form } from "@/components/ui/form";
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
interface Image {
  id: number;
  link: string;
  slug: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished]=useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [localImages, setLocalImages] = useState<{ [filename: string]: string }>({});
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [img, setImg] = useState<{ [imageLink: string]: { isLocal: boolean } }>({});
  const [done,setDone]=useState(false);
  const [specifications, setSpecifications] = useState<SpecType>({
    specRow1: ["", ""],
  });
  const [chemicals, setChemicals] = useState<SpecType>({
    chemRow1: ["", ""],
  });
  const [mechanicals, setMechanicals] = useState<SpecType>({
    mechRow1: ["", ""],
  });
  const totalSteps = 6;
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [enterTableData, setEnterTableData] = useState<boolean | null>(null);
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

  const handleTableDataChoice = async (choice: boolean) => {
    setEnterTableData(choice);
    console.log("Enter Table Data Choice:", choice);
  
    if (!choice) {
      console.log("Product Name:", productValue || "Not entered yet");
  
      // Skip to image section
      // Define prompts for chemical, physical, and mechanical specifications
      const prompts = {
        chemical: `Generate a JSON table with the format: { "row1": ["Column1Data", "Column2Data", ...], "row2": [...], ... }. The table should list the chemical specifications of the product "${productValue}". Include columns for "Chemical Name", "Chemical Formula", "Concentration (%)", and "Purity Level". Ensure all data entries are realistic and relevant to ${productValue}.`,
        physical: `Generate a JSON table with the format: { "row1": ["Column1Data", "Column2Data", ...], "row2": [...], ... }. The table should list the physical specifications of the product "${productValue}". Include columns for "Property Name", "Unit of Measurement", "Typical Value", and "Range (if applicable)". Examples of properties include "Density", "Melting Point", "Boiling Point", and "Viscosity". Provide realistic data for ${productValue}.`,
        mechanical: `Generate a JSON table with the format: { "row1": ["Column1Data", "Column2Data", ...], "row2": [...], ... }. The table should list the mechanical specifications of the product "${productValue}". Include columns for "Property Name", "Measurement Unit", "Value", and "Test Standard". Examples of properties include "Tensile Strength", "Hardness", "Modulus of Elasticity", and "Yield Strength". Provide realistic and relevant data for ${productValue}.`,
      };
  
      const requestData = (prompt: string) => ({
        prompt,
        type: {
          file: "text",
          name: "Table",
        },
      });
  
      try {
        // Make API calls concurrently for all specification types
        const [chemicalResponse, physicalResponse, mechanicalResponse] = await Promise.all([
          axios.post("/api/generate", requestData(prompts.chemical)),
          axios.post("/api/generate", requestData(prompts.physical)),
          axios.post("/api/generate", requestData(prompts.mechanical)),
        ]);
  
        // Parse and validate responses
        const chemicalSpecifications = JSON.parse(chemicalResponse.data.text || "{}");
        const physicalSpecifications = JSON.parse(physicalResponse.data.text || "{}");
        const mechanicalSpecifications = JSON.parse(mechanicalResponse.data.text || "{}");
  
        console.log("Chemical Specifications:", chemicalSpecifications);
        console.log("Physical Specifications:", physicalSpecifications);
        console.log("Mechanical Specifications:", mechanicalSpecifications);
  
        // Update states with parsed data
        setSpecifications(physicalSpecifications);
        setChemicals(chemicalSpecifications);
        setMechanicals(mechanicalSpecifications);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  

  const formatArrayToObject = (inputArray: string[][]): { [key: string]: string[] } => {
    return inputArray.reduce((obj, item, index) => {
      obj[`row${index + 1}`] = item;
      return obj;
    }, {} as { [key: string]: string[] });
  };
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/media/fetch/db");
        setImages(response.data);

        const resp = await axios.get("/api/media/fetch/local");
        setLocalImages(resp.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);
  // console.log(localImages)
  const dbSlugs = images.map((image) => image.slug);
  // console.log(dbSlugs);
  const unmatchedLocalImages = Object.entries(localImages).filter(([filename]) =>!dbSlugs.includes(filename));

  const addSelection = (imageLink: string, isLocal: boolean) => {
    setImg((prev) => ({
      ...prev,
      [imageLink]: { isLocal }
    }));
  };
  const addSelectedImage = async (imageLink: string, isLocal: boolean): Promise<string | undefined> => {
    if (isLocal) {
      try {
        const response = await fetch(imageLink);
        const blob = await response.blob();
        const filename = imageLink.split('/').pop() || "localImage.png";
  
        const file = new File([blob], filename, { type: blob.type });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("wpuser", wordpress.wpuser);
        formData.append("wppass", wordpress.wppass);
        formData.append("wpurl",wordpress.url);
        const responseUpload = await axios.post("/api/media/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        const data = {
          imgId: responseUpload.data.data.id,
          slug: responseUpload.data.data.slug,
          link: responseUpload.data.data.link,
        };
        await axios.post("/api/media/insert",data);
        return data.link;  // Return the link after upload
        
      } catch (error) {
        console.error("Error uploading unmatched image:", error);
        toast({
          title: "Error uploading unmatched image",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } else {
      return imageLink;  // Return the link for non-local images directly
    }
  };  
  
  // For debugging, log `selectedImages` changes to confirm updates
  // useEffect(() => {
  //   console.log("Selected images updated:", selectedImages);
  // }, [selectedImages]);
  
  const [productValue, setProductValue] = useState("");
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    data.post_id = 108765;
    console.log(img)
    // const tempSelectedImages: string[] = [];

    // const imagePromises = Object.entries(img).map(([imageLink, { isLocal }]) => {
    //   return addSelectedImage(imageLink, isLocal).then((uploadedImageLink) => {
    //     if (uploadedImageLink) {
    //       tempSelectedImages.push(uploadedImageLink);  // Add to temporary array
    //     }
    //   });
    // });
  
    // // Await all image uploads/selection updates
    // await Promise.all(imagePromises);
    const tempSelectedImages = await Promise.all(
      selectedImages.map((imageLink) => {
        const isLocal = unmatchedLocalImages.some(([_, url]) => url === imageLink);
        return addSelectedImage(imageLink, isLocal);
      })
    );
  
    // Construct the dynamic specification, chemical, and mechanical data
    console.log(enterTableData)
    const imagearr=await axios.post("/api/webscrap/image",{title:productValue});
    const trimmedImageArr=imagearr.data.images.slice(1,-1);
    const formattedSpecifications = enterTableData?formatArrayToObject(Object.values(specifications)):specifications;
  const formattedChemicals = enterTableData?formatArrayToObject(Object.values(chemicals)):chemicals;
  const formattedMechanicals = enterTableData?formatArrayToObject(Object.values(mechanicals)):mechanicals;
  const advantageJson = {
    "prompt": `List the advantages of ${data.product} pipes. Use only <ol><li> tags for each point, and highlight key phrases with <b>bold</b> tags. Base the content on the details provided in this image: ${trimmedImageArr[0]}. Take all bold points from the image. Ensure the points are concise, clear, and professional.`,
    "type": {
      "file": "text",
      "name": "advantages"
    }
  };
  
    const applicationJson={
      "prompt": `Write the application of ${data.product} in industries in total of 4 number of points using only <ol><li> tags and bold tags for specific points, do not mention any of its byproducts`,
      "type": {
        "file": "text",
        "name": "applications"
      }
    }
    const chooseJson={
      "prompt": `Write the answer to How to Choose the Right ${data.product} Pipe in total of minimum 7 number of points using only <ol><li> tags and bold tags for specific points`,
      "type": {
        "file": "text",
        "name": "choose product"
      }
    }
    const questionJson={
      "prompt": `Generate 4 questions and answers, the answers should be large paragraphs json on ${data.product} pipes in the given format {questions:[{question:some question, answer: some answer}, {question:some question again, answer: some answer again}..... ]}`,
      "type": {
        "file":"text",
        "name":"QuestionAnswer"
      }
    }
    const summaryJson={
      "prompt": `Write the summary of the application of ${data.product} in a short, do not mention any of its byproducts made from it.`,
      "type": {
        "file": "text",
        "name": "applications"
      }
    }
    const advantage=await axios.post("/api/generate",advantageJson)
    const application=await axios.post("/api/generate",applicationJson)
    const choose=await axios.post("/api/generate",chooseJson)
    const questions=await axios.post("/api/generate",questionJson)
    const summary=await axios.post("/api/generate",summaryJson)
    // Construct the JSON payload
    const quest = JSON.parse(questions.data.text);
    const jsonPayload = {
        title: data.product,
        titleDescription: data.title_description || "",
        topDescription: data.top_description || "",
      specification: formattedSpecifications,
      chemicalSpec: formattedChemicals,
      mechanicalSpec: formattedMechanicals,
      advantage: advantage.data.text,
      application: application.data.text,
      choose:choose.data.text,
      questions:quest.questions,
      images:trimmedImageArr,
      summary:summary.data.text
    };
    console.log(jsonPayload);
    try {
      console.log(jsonPayload);
      const response = await axios.post("/api/product/insert", jsonPayload);
      setLoading(false);
      setFinished(true);
      toast({
        title: "Product inserted successfully",
        });
    } catch (error) {
      toast({
        title: "Error submitting data",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };
  

  return (
    <div>
        <a href="/dashboard/material">back</a>
    <div className="w-full max-w-lg mx-auto p-6 overflow-auto">
      <h1 className="text-lg font-bold mb-4 text-center">
        {!done && (currentStep === 1
          ? "Create New Post"
          : currentStep === 2
          ? "Add Description"
          : currentStep === 3
          ? "Add Specifications"
          : currentStep === 4
          ? "Add Chemical Composition"
          : currentStep === 5?
           "Add Mechanical Properties"
          : currentStep===6?
          "Add Advantage Image"
        :"")}
      </h1>

      <Progress value={(currentStep / totalSteps) * 100} className="mb-6" />

      {finished ? (
        <div className="flex flex-col items-center gap-4">
          <a href="/dashboard/product">Go back</a>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields for "Create New Post" and "Add Description" steps */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <Input placeholder="Product"
               {...register("product")}
               value={productValue}
      onChange={(e) => setProductValue(e.target.value)} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
                 <Textarea
                placeholder="Title Description"
                {...register("title_description")}
              />
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
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skip Specification Generation</DialogTitle>
        </DialogHeader>
        <p>Do you want to skip entering table data?</p>
        <DialogFooter>
          <Button
            type="button"
            onClick={async () => {
              setLoading(true);
              await handleTableDataChoice(false);
              setLoading(false);
              setDialogOpen(false); // Close the dialog after operation
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Yes"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

{currentStep === 6 && (
  <div>
    <Tabs defaultValue="dbImages" className="w-full">
      <TabsList className="flex justify-center">
        <TabsTrigger value="dbImages" className="px-4 py-2">
          Images in DB
        </TabsTrigger>
        <TabsTrigger value="localImages" className="px-4 py-2">
          Local Images
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dbImages" className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Images in DB:</h3>
        <div className="flex flex-wrap gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex flex-col items-center w-32 h-32 border rounded-lg shadow-md p-2"
            >
              <img
                src={image.link}
                alt={image.slug}
                className="w-full h-24 object-cover rounded-md"
              />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedImages.includes(image.link)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedImages((prev) => [...prev, image.link]);
                    } else {
                      setSelectedImages((prev) =>
                        prev.filter((img) => img !== image.link)
                      );
                    }
                  }}
                />
                Select
              </label>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="localImages" className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Local Images:</h3>
        <div className="flex flex-wrap gap-4">
          {unmatchedLocalImages.map(([filename, url]) => (
            <div
              key={filename}
              className="flex flex-col items-center w-32 h-32 border rounded-lg shadow-md p-2"
            >
              <img
                src={url}
                alt={filename}
                className="w-full h-24 object-cover rounded-md"
              />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedImages.includes(url)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedImages((prev) => [...prev, url]);
                    } else {
                      setSelectedImages((prev) =>
                        prev.filter((img) => img !== url)
                      );
                    }
                  }}
                />
                Select
              </label>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  </div>
)}


          <Button type="submit" className="w-full mt-4" disabled={loading || currentStep!==6} onClick={()=>setDone(true)}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      )}

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || done}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
          disabled={currentStep === totalSteps || done}
        >
          Next
        </Button>
      </div>
    </div>
    </div>
  );
}
