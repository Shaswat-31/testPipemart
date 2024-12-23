"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import placeholder from './placehoder.json';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/layout/header";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { DragEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { IoMdArrowRoundBack } from "react-icons/io";
// Define Section type based on your JSON structure
interface Section {
  id: string;
  elType: string;
  settings: {
    title?: string;
    [key: string]: any; // Any additional fields in `settings`
  };
  elements: any[]; // Adjust as needed
  widgetType?: string;
}

// Define Cluster type
interface Cluster {
  sections: string[];
  name: string;
}

// Type assertion for the placeholder data
const initialSections = placeholder as Record<string, Section>;

export default function DragDrop() {
  const [sections, setSections] = useState<Record<string, Section>>(initialSections);
  const [draggedSection, setDraggedSection] = useState<number | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([
    { sections: ["section1", "section2"], name: "title" },
    { sections: ["section3"], name: "Table of content" },
    { sections: ["section4"], name: "Product description" },
    { sections: ["section5", "section6"], name: "specification" },
    { sections: ["section7", "section8"], name: "Chemical composition" },
    { sections: ["section9", "section10", "section11"], name: "Grades" },
    { sections: ["section12", "section13"], name: "Mechanical properties" },
    { sections: ["section14", "section15"], name: "Praise description" },
    { sections: ["section16"], name: "Request a quote" },
    { sections: ["section17", "section18", "section19", "section20"], name: "Advantages" },
    { sections: ["section21", "section22"], name: "Types" },
    { sections: ["section23", "section24", "section25", "section26"], name: "Application" },
    { sections: ["section27", "section28", "section29", "section30"], name: "Questions" },
    { sections: ["section31", "section32"], name: "FAQ" },
  ]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [postData, setPostData] = useState({ new_post_name: "", new_post_title: "" });
  const router = useRouter();
  const handleDragStart = (index: number) => {
    console.log(initialSections)
    setDraggedSection(index);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const [wordpress, setWordpress] = useState<any>(false);
  const website = useSelector((state: RootState) => state.wordpress)
  useEffect(()=>{
    setWordpress(website)
  },[website])
  const handleDrop = (index: number) => {
    if (draggedSection === null) return;

    setLoading(true);
    const updatedClusters = [...clusters];
    const [draggedCluster] = updatedClusters.splice(draggedSection, 1);
    updatedClusters.splice(index, 0, draggedCluster);
    setClusters(updatedClusters);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleSave = async () => {
    setLoading(true);
    // Explicitly define the type for updatedSections
  const updatedSections: Record<string, Section> = {}; // Use Record type to map string keys to Section values
  let sectionCounter = 1;
  
    clusters.forEach((cluster) => {
      cluster.sections.forEach((sectionKey) => {
        const newSectionKey = `section${sectionCounter}`;
        updatedSections[newSectionKey] = { ...sections[sectionKey] };
        sectionCounter++;
      });
    });
  
    setSections(updatedSections);
    const tempid=wordpress.temp_id;
    const res = {
      db:{
        username:wordpress.username,
        password:wordpress.password,
        host:wordpress.hostUrl,
        database:wordpress.databaseName
      },
      original_post_id: tempid,
      new_post_name: postData.new_post_name,
      new_post_title: postData.new_post_title,
      placeholders: updatedSections,
      table_prefix:wordpress.table_prefix
    };
   
    console.log(wordpress.wordpress_id);
    try {
     
      const response = await axios.post("/api/temp/pipe", res);
      console.log("Data sent:", response.data);
      const newPostId = response.data.newPostId;
      console.log(newPostId)
      const templateData = {
        post_id: newPostId,
        post_name: postData.new_post_name,
        url: `${wordpress.url}/${postData.new_post_name}`,
        wordpressId:wordpress.wordpress_id
      };
  
      await axios.post("/api/temp/insert", templateData);
      console.log(res);
      console.log(res.placeholders)
      // Show success toast notification
      toast({
        title: "Saved Successfully",
        description: "Data has been saved and updated successfully.",
        variant: "default",
      });
    } catch (error) {
      // Show error toast notification
      toast({
        title: "Error submitting data",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      router.push("/dashboard/templates");
    }
  };
  

  return (
    <div>
      <Header />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter New Post Details</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Post Name"
            value={postData.new_post_name}
            onChange={(e) => setPostData({ ...postData, new_post_name: e.target.value })}
            className="mb-4"
          />
          <Input
            placeholder="Post Title"
            value={postData.new_post_title}
            onChange={(e) => setPostData({ ...postData, new_post_title: e.target.value })}
            className="mb-4"
          />
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col justify-center items-center w-full h-screen overflow-hidden p-6">
        <div className="w-full flex justify-start">
        <a href="/dashboard/templates" className="text-blue-500 hover:underline text-3xl mt-4 ml-4">
            <IoMdArrowRoundBack />
            </a>
        </div>
       
      <ScrollArea className="max-h-[calc(100vh-200px)] p-4 space-y-4 w-full">
        <div className="space-y-3">
          {clusters.map((cluster, index) => (
            <Card
              key={index}
              className={cn(
                "p-4 border border-muted bg-secondary rounded-md transition-all",
                loading ? "opacity-50 cursor-not-allowed" : "cursor-grab hover:shadow-lg"
              )}
              draggable={!loading}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => !loading && handleDrop(index)}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary">{cluster.name}</CardTitle>
              </CardHeader>
              {/* <CardContent className="flex flex-col space-y-2">
                {cluster.sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="p-2 bg-gray-100 rounded-md text-sm shadow-sm transition-all"
                  >
                    {section}
                  </div>
                ))}
              </CardContent> */}
            </Card>
          ))}
        </div>
      </ScrollArea>
      <Button
            onClick={handleSave}
            className={cn(
              "w-full max-w-6xl mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg transition-all",
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-lg"
            )}
            variant="secondary"
            disabled={loading}
          >
            {loading ? "loading..." : "Save"}
          </Button>
      </div>
    </div>
  );
}
