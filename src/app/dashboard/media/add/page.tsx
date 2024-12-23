'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatusMessage('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      // Make the POST request to your API
      const response = await axios.post('/api/media/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
       console.log(response.data.data.id);
       console.log(response.data.data.slug);
       console.log(response.data.data.link);
        const data={
            imgId:response.data.data.id,
            slug:response.data.data.slug,
            link:response.data.data.link
        }
        try{
            await axios.post('/api/media/insert',data);
        }
        catch(error)
        {
            setLoading(false);
      console.error('Error uploading image:', error);
      setStatusMessage('An error occurred during image upload.');
        }
      if (response.status === 200) {
        setStatusMessage('Image uploaded successfully!');
        console.log('Response:', response.data);
      } else {
        setStatusMessage('Image upload failed.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image:', error);
      setStatusMessage('An error occurred during image upload.');
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
    <div className="p-6 mx-auto rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file">Select an image:</Label>
          <Input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" variant="secondary">
            Upload Image
          </Button>
          {statusMessage && (
            <Alert variant="default" className="text-sm">
              {statusMessage}
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}
