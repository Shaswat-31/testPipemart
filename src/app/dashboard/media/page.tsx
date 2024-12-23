"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';

interface Image {
  id: number;
  link: string;
  slug: string;
}

export default function Page() {
  const [images, setImages] = useState<Image[]>([]);  // Store Image objects
  const [localImages, setLocalImages] = useState<{ [filename: string]: string }>({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch images from the database
        const response = await axios.get("/api/media/fetch/db");
        setImages(response.data); // Store as array of Image objects

        // Fetch images from the local folder
        const resp = await axios.get("/api/media/fetch/local");
        setLocalImages(resp.data);  // Assuming resp.data is an object with filename: URL pairs
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);

  // Extract slugs from database images for comparison
  const dbSlugs = images.map(image => image.slug);

  // Filter local images whose filename is not in the db slugs
  const unmatchedLocalImages = Object.entries(localImages).filter(
    ([filename]) => !dbSlugs.includes(filename)
  );

  const handle = () => {
    console.log(localImages);
    console.log(dbSlugs);
    console.log(unmatchedLocalImages);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <h3>Images in DB:</h3>
        {images.map((image, index) => (
          <div key={index} className="w-24 h-24 rounded-lg shadow-md">
            <img src={image.link} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      
      <div>
        <button onClick={handle}>Click</button>
        <h3>Local Images:</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(localImages).map(([filename, url], index) => (
            <div key={index} className="w-24 h-24 rounded-lg shadow-md">
              <img src={url} alt={filename} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <h3>Unmatched Local Images:</h3>
        {unmatchedLocalImages.map(([filename, url], index) => (
          <div key={index} className="w-24 h-24 rounded-lg shadow-md">
            <img src={url} alt={filename} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
