"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import menus from "./menus.json";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import allCorousel from "./corousel/elementorCorousel";
import App from "next/app";
import { useProducts } from "./hooks/useProducts";
import { useCities } from "./hooks/useCities";
import { useTemplates } from "./hooks/useTemplates";
interface QuestionAnswer {
  question: string;
  answer: string;
}
interface Product {
  id: string;
  title: string;
  titleDescription: string;
  topDescription: string;
  advantage: string;
  application: string;
  choose: string;
  questions: QuestionAnswer[]; // Define questions as an array of QuestionAnswer objects
  specification: Record<string, string[]>; // For dynamic rows
  chemicalSpec: Record<string, string[]>;
  mechanicalSpec: Record<string, string[]>;
  images: string[];
  industry: string[];
  applicationSummary: string;
}

interface City {
  id: string;
  cityName: string;
  country: string;
}

interface Template {
  id: string;
  post_id: number;
  post_name: string;
}

interface Entry {
  id: number;
  product: Product;
  city: City;
  template: Template;
  status: "Not Published" | "Pending" | "Published";
  url: string;
}
interface menus {
  [key: string]: string;
}
interface ProductHeading {
  id: string;
  title: string;
  heading: string[];
}
interface SeoResponse {
  title: string;
  description: string;
}
export default function Home() {
  const [loading, setLoading] = useState(false);
  // const [productData, setProductData] = useState<Product[]>([]);
  // const [cityData, setCityData] = useState<City[]>([]);
  // const [templateData, setTemplateData] = useState<Template[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState("");
  const [wordpress, setWordpress] = useState<any>(false);
  const website = useSelector((state: RootState) => state.wordpress);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  useEffect(() => {
    setWordpress(website);
  }, [website]);
  const categoryName = categories.reduce((acc, category) => {
    return category.id === selectedCategory ? category.name : acc;
  }, "");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category/fetch");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       // Fetch data in parallel using Promise.all
  //       const [productRes, cityRes, templateRes] = await Promise.all([
  //         axios.get("/api/product/fetch/all"),
  //         axios.get("/api/city/fetch"),
  //         fetch(`/api/temp/fetch?wordpressId=${website.wordpress_id}`).then(
  //           (res) => res.json()
  //         ),
  //       ]);

  //       // Filter the product data to include only those whose title contains the categoryName
  //       const filteredProducts = productRes.data.filter((Product: Product) =>
  //         Product.title.includes(categoryName)
  //       );

  //       // Update the state with the fetched and filtered data
  //       if (categoryName) {
  //         setProductData(filteredProducts);
  //       }
  //       setCityData(cityRes.data);
  //       setTemplateData(templateRes);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [categoryName]);
  const { data: productData = [], isLoading: productsLoading } = useProducts(categoryName);
  const { data: cityData = [], isLoading: citiesLoading } = useCities();
  const { data: templateData = [], isLoading: templatesLoading } = useTemplates(website.wordpress_id);
  const filteredProductData = productData.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCityData = cityData.filter((city) =>
    `${city.cityName.toLowerCase()} ${city.country.toLowerCase()}`.includes(
      searchTerm.toLowerCase()
    )
  );
  const filteredTemplateData = templateData.filter((template) =>
    template.post_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const generateRandomSuffix = async (length = 5) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };
  const generateEntries = async() => {
    if (!selectedTemplate) {
      setAlert("Please select a template before generating entries.");
      return;
    }
    const newEntries: Entry[] = [];
    for (const product of selectedProducts) {
      for (const city of selectedCities) {

        const cityName = city.cityName.trim().replace(/\s+/g, ""); // Remove spaces
        const productName = product.title
          .trim()
          .replace(`${categoryName}`, "")
          .trim();
        const slug = `${productName}-${categoryName}-${cityName}`;
        const sanitizedSlug = slug
          .replace(" ", "-")
          .replace(/[^a-zA-Z0-9-]/g, "")
          .toLowerCase();
          const url=`${wordpress.url}/${sanitizedSlug}-TPM0002`;
          if (newEntries.some((entry) => entry.url === url)) {
            console.warn(
              `Duplicate URL detected: ${url}. Skipping entry for product ${productName} in city ${cityName}.`
            );
            continue; 
          }
        newEntries.push({
          id: newEntries.length,
          product,
          city,
          template: selectedTemplate,
          status: "Not Published",
          url: `${wordpress.url}/${sanitizedSlug}-TPM0002`,
        });
        const apiUrl = "/api/entry/add";
        const entry = {
          productId: product.id,
          cityId: city.id,
          templateId: selectedTemplate.id,
          status: "NOT_PUBLISHED",
          url: `${wordpress.url}/${sanitizedSlug}-TPM0002`,
        };
  
        // try {
        //   // Send POST request to API
        //   const response = await fetch(apiUrl, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(entry),
        //   });
  
        //   if (response.ok) {
        //     const savedEntry = await response.json();
        //     console.log(savedEntry)
        //   } else {
        //     const errorData = await response.json();
        //     console.error("Error saving entry:", errorData);
        //     setAlert(`Failed to save entry for product ${productName} in city ${cityName}`);
        //   }
        // } catch (error) {
        //   console.error("Error sending POST request:", error);
        //   setAlert("An unexpected error occurred while generating entries.");
        // }
      };
    };
    console.log(newEntries)
    setEntries(newEntries);
  };

  const handlePublishAll = async () => {
    setLoading(true);
    console.log(wordpress);
    console.log(selectedCategory);
    setEntries((prevEntries) =>
      prevEntries.map((entry) => ({ ...entry, status: "Pending" }))
    );

    for (const entry of entries) {
      const productName = entry.product.title
        .trim()
        .replace(`${categoryName}`, "")
        .trim();
      console.log(productName);
      const cityName = entry.city.cityName.trim().replace(/\s+/g, ""); // Remove spaces
      const slug = `${productName}-${categoryName}-${cityName}`;
      console.log(slug);
      const sanitizedSlug = slug
        .replace(" ", "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .toLowerCase(); // Remove special characters and make lowercase
      console.log(sanitizedSlug); // "wnewyork71" or similar
      const randomImage =
        entry.product.images[
          Math.floor(Math.random() * entry.product.images.length)
        ];

      // const imageExt1 = entry.product.images[1].split('/').slice(-2, -1)[0];
      // const imageCap1 = imageExt1.split('.').slice(0, -1).join('.').replace(/-/g, ' ');

      // const imageExt2 = entry.product.images[2].split('/').slice(-2, -1)[0];
      // const imageCap2 = imageExt2.split('.').slice(0, -1).join('.').replace(/-/g, ' ');

      // const imageExt3 = entry.product.images[3].split('/').slice(-2, -1)[0];
      // const imageCap3 = imageExt3.split('.').slice(0, -1).join('.').replace(/-/g, ' ');

      // const imageExt4 = entry.product.images[4].split('/').slice(-2, -1)[0];
      // const imageCap4 = imageExt4.split('.').slice(0, -1).join('.').replace(/-/g, ' ');

      // const imageExt5 = entry.product.images[5].split('/').slice(-2, -1)[0];
      // const imageCap5 = imageExt5.split('.').slice(0, -1).join('.').replace(/-/g, ' ');

      // const imageExt6 = entry.product.images[6].split('/').slice(-2, -1)[0];
      // const imageCap6 = imageExt6.split('.').slice(0, -1).join('.').replace(/-/g, ' ');

      const captions =
        entry.product.images?.map((url) => {
          if (url) {
            // Check if url is defined
            const fileName = url.split("/").pop()?.split(".")[0]; // Extract the filename without extension
            fileName?.replace(/-/g, " ") || ""; // Replace hyphens with spaces or return empty string if undefined
            return fileName?.replace("UAE", entry.city.country) || "";
          }
          return "";
        }) || [];
      const menuCategory = categoryName.replace(/s$/, "").toLowerCase();
      const menu1Key = `${productName.toLowerCase()} ${menuCategory}`;
      const menu2Key = `other ${productName.toLowerCase()} product`;

      // Safely retrieve menu values
      const menu1 = menus[menu1Key as keyof typeof menus] || "";
      const menu2 = menus[menu2Key as keyof typeof menus] || "";

      console.log(`${productName} ${categoryName}`);
      const grades = await axios.post("/api/grades/fetchFromJson", {
        title: `${productName} ${categoryName}`,
      });
      const gradeArray = grades.data.grade;
      console.log(menu1, menu2, gradeArray);
      const industryImageArray = wordpress.industry;
      console.log(industryImageArray);
      const inudstryNameArray = industryImageArray.map((imageUrl: string) => {
        const parts = imageUrl.split("/").filter(Boolean);
        const fileName = parts[parts.length - 1];
        return fileName.replace(/-/g, " ").replace(" abcde", "");
      });
      console.log(inudstryNameArray);
      const industryObject: Record<string, string> = {};
      for (let i = 0; i < inudstryNameArray.length; i++) {
        industryObject[inudstryNameArray[i]] = industryImageArray[i];
      }
      console.log(industryObject);
      console.log(entry.product.industry);
      const fetchedHeading = await axios.post("/api/heading", {
        title: entry.product.title,
      });
      console.log(fetchedHeading);
      const headings = fetchedHeading.data.heading;
      console.log(headings);
      const seo = await axios.post("/api/seo", {
        name: entry.product.title,
      });
      console.log(seo);
      let yoastTitle = seo.data[0].title;
      let yoastDesc = seo.data[0].description;
      const jsonPayload = {
        original_post_id: entry.template.post_id,
        new_post_name: `${sanitizedSlug}-TPM0002`,
        new_post_title: productName,
        url: wordpress.url,
        yoastTitle: yoastTitle
          .replace(/UAE/gi, entry.city.country)
          .replace(/Dubai/gi, entry.city.cityName)
          .replace(/Abu Dhabi/gi, entry.city.cityName)
          .replace(/Sharjah/gi, entry.city.cityName),
        yoastDesc: yoastDesc
          .replace(/UAE/gi, entry.city.country)
          .replace(/Dubai/gi, entry.city.cityName)
          .replace(/Abu Dhabi/gi, entry.city.cityName)
          .replace(/Sharjah/gi, entry.city.cityName),
        placeholders: {
          slug:productName.toLowerCase().replace(/\s+/g, "-"),
          category: categoryName,
          title: productName,
          city: entry.city.cityName,
          country: entry.city.country,
          title_description: entry.product.titleDescription || "",
          top_description: entry.product.topDescription || "",
          advantage: entry.product.advantage,
          application: entry.product.application,
          choose: entry.product.choose,
          question1: entry.product.questions[0].question,
          question2: entry.product.questions[1].question,
          question3: entry.product.questions[2].question,
          question4: entry.product.questions[3].question,
          answer1: entry.product.questions[0].answer,
          answer2: entry.product.questions[1].answer,
          answer3: entry.product.questions[2].answer,
          answer4: entry.product.questions[3].answer,
          advantageImage: entry.product.images[0],
          image1: entry.product.images[1],
          imageCap1: captions[1],
          imageCap2: captions[2],
          imageCap3: captions[3],
          imageCap4: captions[4],
          imageCap5: captions[5],
          imageCap6: captions[6],
          image2: entry.product.images[2],
          image3: entry.product.images[3],
          image4: entry.product.images[4],
          image5: entry.product.images[5],
          image6: entry.product.images[6],
          menu1: menu1,
          menu2: menu2,
          summary: entry.product.applicationSummary,
          applicationImage1: industryObject[entry.product.industry[0]],
          applicationCaption1: entry.product.industry[0],
          applicationImage2: industryObject[entry.product.industry[1]],
          applicationCaption2: entry.product.industry[1],
          applicationImage3: industryObject[entry.product.industry[2]],
          applicationCaption3: entry.product.industry[2],
          applicationImage4: industryObject[entry.product.industry[3]],
          applicationCaption4: entry.product.industry[3],
          heading1: headings[0]
            ? headings[0]
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName)
            : " ",
          heading2: headings[1]
            ? headings[1]
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName)
            : " ",
          heading3: headings[2]
            ? headings[2]
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName)
            : " ",
          heading4: headings[3]
            ? headings[3]
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName)
            : " ",
          heading5: headings[4]
            ? headings[4]
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName)
            : " ",
        },
        specification: entry.product.specification || {},
        chemicalSpec: entry.product.chemicalSpec || {},
        mechanicalSpec: entry.product.mechanicalSpec || {},
        grade: grades.data.grade,
        db: {
          username: wordpress.username,
          password: wordpress.password,
          host: wordpress.hostUrl,
          database: wordpress.databaseName,
        },
        table_prefix: wordpress.table_prefix,
      };
      console.log(jsonPayload);
      try {
        await axios.post("/api/pipes", jsonPayload);
        for (const gr of jsonPayload.grade) {
          console.log(gr);
          try {
            const fetchedGradeHeading = await axios.post("/api/heading", {
              title: gr,
            });
            const gradeHeadings = fetchedGradeHeading.data.heading;
            console.log("Processing grade:", gr);
            const responseData = await axios.post("/api/grades/fetch", {
              grade: gr,
            });
            const gradeData: Product = responseData.data[0];
            console.log("Fetched Grade Data:", gradeData);

            const gradeCaptions =
              gradeData.images?.map((url) => {
                if (url) {
                  const fileName = url.split("/").pop()?.split(".jpg")[0];
                  return (
                    fileName
                      ?.replace(/-/g, " ")
                      .replace("UAE", entry.city.country) || ""
                  );
                }
                return "";
              }) || [];
            const cityName = jsonPayload.placeholders.city
              .trim()
              .replace(/\s+/g, "");
            const gradeSlug = gr.replace(/ /g, "-");
            const gradeName = gr.trim().replace(`${categoryName}`, "").trim();
            const grSeo = await axios.post("/api/seo", {
              name: gr,
            });
            let gryoastTitle = grSeo.data[0].title;
            let gryoastDesc = grSeo.data[0].description;
            const gradeJsonPayload = {
              original_post_id: entry.template.post_id,
              new_post_name: `${gradeSlug.replace(
                /\//g,
                "-"
              )}${cityName}-TPM0001`,
              new_post_title: gradeName,
              url: wordpress.url,
              yoastTitle: gryoastTitle
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName),
              yoastDesc: gryoastDesc
                .replace(/UAE/gi, entry.city.country)
                .replace(/Dubai/gi, entry.city.cityName)
                .replace(/Abu Dhabi/gi, entry.city.cityName)
                .replace(/Sharjah/gi, entry.city.cityName),
              placeholders: {
                slug:gradeName.toLowerCase().replace(/\s+/g, "-"),
                category: categoryName,
                title: gradeName,
                city: entry.city.cityName,
                country: entry.city.country,
                title_description: gradeData.titleDescription || "",
                top_description: gradeData.topDescription || "",
                advantage: gradeData.advantage,
                application: gradeData.application,
                choose: gradeData.choose,
                question1: gradeData.questions[0].question,
                question2: gradeData.questions[1].question,
                question3: gradeData.questions[2].question,
                question4: gradeData.questions[3].question,
                answer1: gradeData.questions[0].answer,
                answer2: gradeData.questions[1].answer,
                answer3: gradeData.questions[2].answer,
                answer4: gradeData.questions[3].answer,
                advantageImage: gradeData.images[0],
                image1: gradeData.images[1],
                imageCap1: gradeCaptions[1],
                imageCap2: gradeCaptions[2],
                imageCap3: gradeCaptions[3],
                imageCap4: gradeCaptions[4],
                imageCap5: gradeCaptions[5],
                imageCap6: gradeCaptions[6],
                image2: gradeData.images[2],
                image3: gradeData.images[3],
                image4: gradeData.images[4],
                image5: gradeData.images[5],
                image6: gradeData.images[6],
                menu1: menu1,
                menu2: menu2,
                summary: gradeData.applicationSummary,
                applicationImage1: industryObject[gradeData.industry[0]],
                applicationCaption1: gradeData.industry[0],
                applicationImage2: industryObject[gradeData.industry[1]],
                applicationCaption2: gradeData.industry[1],
                applicationImage3: industryObject[gradeData.industry[2]],
                applicationCaption3: gradeData.industry[2],
                applicationImage4: industryObject[gradeData.industry[3]],
                applicationCaption4: gradeData.industry[3],
                heading1: gradeHeadings[0]
                  ? gradeHeadings[0]
                      .replace(/UAE/gi, entry.city.country)
                      .replace(/Dubai/gi, entry.city.cityName)
                      .replace(/Abu Dhabi/gi, entry.city.cityName)
                      .replace(/Sharjah/gi, entry.city.cityName)
                  : " ",
                heading2: gradeHeadings[1]
                  ? gradeHeadings[1]
                      .replace(/UAE/gi, entry.city.country)
                      .replace(/Dubai/gi, entry.city.cityName)
                      .replace(/Abu Dhabi/gi, entry.city.cityName)
                      .replace(/Sharjah/gi, entry.city.cityName)
                  : " ",
                heading3: gradeHeadings[2]
                  ? gradeHeadings[2]
                      .replace(/UAE/gi, entry.city.country)
                      .replace(/Dubai/gi, entry.city.cityName)
                      .replace(/Abu Dhabi/gi, entry.city.cityName)
                      .replace(/Sharjah/gi, entry.city.cityName)
                  : " ",
                heading4: gradeHeadings[3]
                  ? gradeHeadings[3]
                      .replace(/UAE/gi, entry.city.country)
                      .replace(/Dubai/gi, entry.city.cityName)
                      .replace(/Abu Dhabi/gi, entry.city.cityName)
                      .replace(/Sharjah/gi, entry.city.cityName)
                  : " ",
                heading5: gradeHeadings[4]
                  ? gradeHeadings[4]
                      .replace(/UAE/gi, entry.city.country)
                      .replace(/Dubai/gi, entry.city.cityName)
                      .replace(/Abu Dhabi/gi, entry.city.cityName)
                      .replace(/Sharjah/gi, entry.city.cityName)
                  : " ",
              },
              specification: gradeData.specification || {},
              chemicalSpec: gradeData.chemicalSpec || {},
              mechanicalSpec: gradeData.mechanicalSpec || {},
              grade: grades.data.grade,
              db: {
                username: wordpress.username,
                password: wordpress.password,
                host: wordpress.hostUrl,
                database: wordpress.databaseName,
              },
              table_prefix: wordpress.table_prefix,
            };
            console.log("Grade JSON Payload:", gradeJsonPayload);
            await axios.post("/api/pipes", gradeJsonPayload);
          } catch (err) {
            console.error(
              "Error fetching grade data or building payload for:",
              gr,
              err
            );
          }
        }
        setEntries((prevEntries) =>
          prevEntries.map((e) =>
            e.id === entry.id ? { ...e, status: "Published" } : e
          )
        );
      } catch (error) {
        console.error("Error publishing data:", error);
      }
    }

    setLoading(false);
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prevStep) => prevStep + 1);
    console.log(categories);
    console.log(selectedCategory);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prevStep) => prevStep - 1);
  };
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex flex-col justify-center items-center space-y-3">
  //       <Skeleton className="h-[125px] w-[250px] rounded-xl" />
  //       <div className="space-y-2">
  //         <Skeleton className="h-4 w-[250px]" />
  //         <Skeleton className="h-4 w-[200px]" />
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="w-full mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-8 text-center">Create New Posts</h1>

      {entries.length === 0 && (
        <div className="space-y-8">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 w-full"
          />

          {currentStep === 1 && (
            <div>
              <div>
                {/* <h2 className="text-lg font-semibold mb-4">Select a Category</h2> */}
                <Select
                  value={selectedCategory || undefined}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedProducts([]);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                {/* <h2 className="text-lg font-semibold mb-4 mt-6">Select Products</h2> */}
                <ScrollArea className="h-[calc(80vh-270px)] border rounded-lg p-4 w-full mt-6 overflow-y-auto">
                  {categoryName ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-1 cursor-pointer">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={
                                  selectedProducts.length ===
                                  filteredProductData.length
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProducts(filteredProductData); // Select all
                                  } else {
                                    setSelectedProducts([]); // Remove all
                                  }
                                }}
                              />
                              <span className="text-white">
                                {selectedProducts.length ===
                                filteredProductData.length
                                  ? "Remove All"
                                  : "Select All"}
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          {selectedProducts.length} Products selected
                        </div>
                      </div>

                      {filteredProductData.map((product) => (
                        <div
                        key={product.id}
                        className={`flex items-center gap-4 p-2 rounded-lg border ${
                          selectedProducts.includes(product)
                            ? "border-green-700 shadow-md ring-2 ring-green-500 bg-green-100 text-black py-4 mt-1 mb-1 ml-1 mr-1"
                            : "border-gray-200 shadow-sm hover:shadow-md"
                        } transition-shadow duration-300 cursor-pointer`}
                        onClick={() => {
                          setSelectedProducts((prev) =>
                            selectedProducts.includes(product)
                              ? prev.filter((p) => p.id !== product.id)
                              : [...prev, product]
                          );
                        }}
                      >
                          <div className="flex flex-col">
                            <label className="font-medium text-sm">
                              {product.title}
                            </label>
                            <span className="text-xs">
                              {product.titleDescription ||
                                "No description available"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full h-full bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-300 p-6 rounded-lg shadow-lg">
                      <div className="text-center text-gray-800">
                        <p className="text-3xl font-extrabold text-indigo-700 mb-6 animate-pulse">
                          ✨ Choose a category to explore the products ✨
                        </p>
                        <p className="text-xl font-medium text-gray-600 mb-6">
                          Discover a world of exciting products tailored just
                          for you. Select a category and begin your journey!
                        </p>
                        <div className="mt-4">
                          <svg
                            className="animate-bounce h-14 w-14 text-indigo-500 mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a7 7 0 00-7 7h4l-5 5 5 5h4l-5-5h5a7 7 0 00-7-7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Cities</h2>
              <ScrollArea className="h-[calc(80vh-250px)] border rounded-lg p-4 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6 ml-1 mt-1">
                  <Checkbox
                    checked={selectedCities.length === filteredCityData.length}
                    onCheckedChange={(checked) =>
                      setSelectedCities(checked ? filteredCityData : [])
                    }
                    className="transition-colors duration-200"
                  />
                  <label className="font-medium">
                    {selectedCities.length === filteredCityData.length
                      ? "Remove All"
                      : "Select All"}
                  </label>
                </div>
                {filteredCityData.map((city) => (
                 <div
                 key={city.id}
                 className={`flex items-center gap-4 p-2 rounded-lg border ${
                   selectedCities.includes(city)
                     ? "border-green-700 shadow-md ring-2 ring-green-500 bg-green-100 text-black py-4 mt-1 mb-1 ml-1 mr-1"
                     : "border-gray-200 shadow-sm hover:shadow-md"
                 } transition-shadow duration-300 cursor-pointer`}
                 onClick={() => {
                   setSelectedCities((prev) =>
                     selectedCities.includes(city)
                       ? prev.filter((c) => c.id !== city.id)
                       : [...prev, city]
                   );
                 }}
               >
                    <div className="flex flex-col p-1">
                      <label className="font-medium">{city.cityName}</label>
                      <span className="text-sm text-gray-500">
                        {city.country}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Template</h2>
              <ScrollArea className="h-[calc(80vh-280px)] border rounded-lg p-4 overflow-y-auto">
                {filteredTemplateData.map((template: Template) => (
                  <div
                  key={template.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    selectedTemplate?.id === template.id
                      ? "border-green-700 shadow-md ring-2 ring-green-500 bg-green-100 text-black py-4 mt-1 mb-1 ml-1 mr-1"
                      : "border-gray-200 shadow-sm hover:shadow-md"
                  } transition-shadow duration-300 cursor-pointer`}
                  onClick={() =>
                    setSelectedTemplate((prev) =>
                      prev?.id === template.id ? null : template
                    )
                  }
                >
                    <div className="flex flex-col">
                      <label className="font-medium">
                        {template.post_name}
                      </label>
                      <span className="text-sm text-gray-500">
                        Post ID: {template.post_id}
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              {alert && (
                <Alert variant="destructive" className="text-sm">
                  {alert}
                </Alert>
              )}
            </div>
          )}

          <div className="flex justify-between mt-2 mb-4 mr-4 ml-4">
            <Button
              onClick={handleBack}
              className="w-24 py-2"
              variant="outline"
              disabled={currentStep === 1}
            >
              Back
            </Button>
            <Button
              onClick={currentStep === 3 ? generateEntries : handleNext}
              className="w-24 py-2"
              variant="default"
            >
              {currentStep === 3 ? "Generate" : "Next"}
            </Button>
          </div>
        </div>
      )}

      {/* Entry list rendering remains unchanged */}
      {entries.length > 0 && (
        <ScrollArea className="h-[calc(100vh-220px)] rounded-md border p-4">
          <div className="mt-10 space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-4 p-5 rounded-lg shadow-lg border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    {entry.product.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.city.cityName}, {entry.city.country}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Template: {entry.template.post_name}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      entry.status === "Published"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {entry.status}
                  </span>
                  {entry.status === "Published" && (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline text-sm"
                    >
                      View Post
                    </a>
                  )}
                </div>
              </div>
            ))}
            <Button
              onClick={handlePublishAll}
              className="w-full py-3 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish All"}
            </Button>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
