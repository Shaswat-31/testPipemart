'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from "@/components/ui/skeleton";

type CityStatus = "Not Published" | "Pending" | "Published" | "Error";

type City = {
  id: number;
  cityName: string;
  country: string;
  status?: CityStatus;
};

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [uploadedData, setUploadedData] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatusMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('/api/city/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      if (response.status === 201 && response.data.insertedCities) {
        const citiesWithStatus = response.data.insertedCities.map((city: City) => ({
          ...city,
          status: 'Not Published' as CityStatus,
        }));
        setStatusMessage('File uploaded successfully!');
        setUploadedData(citiesWithStatus);
        setUploaded(true);
      } else {
        setStatusMessage('File upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatusMessage('An error occurred during file upload.');
    }
  };

  const handleInsertAll = async () => {
    const updatedData = uploadedData.map((city) => ({
      ...city,
      status: 'Pending' as CityStatus,
    }));
    setUploadedData(updatedData);

    for (const city of updatedData) {
      try {
        const response = await axios.post('/api/city/insert', {
          cityName: city.cityName,
          country: city.country,
        });

        if (response.status === 201) {
          setUploadedData((prevData) =>
            prevData.map((c) =>
              c.id === city.id ? { ...c, status: 'Published' as CityStatus } : c
            )
          );
        } else {
          setUploadedData((prevData) =>
            prevData.map((c) =>
              c.id === city.id ? { ...c, status: 'Error' as CityStatus } : c
            )
          );
        }
      } catch (error) {
        setUploadedData((prevData) =>
          prevData.map((c) =>
            c.id === city.id ? { ...c, status: 'Error' as CityStatus } : c
          )
        );
      }
    }
  };

  const filteredData = uploadedData.filter((city) =>
    city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisibleButtons = 3;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3, '...');
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push('...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }
    }

    return pageNumbers;
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
        <a href='/dashboard/city'>back</a>
      <div className='max-w-lg'>
        {!uploaded && (<h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>)}
        {!uploaded && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">Select Excel file:</Label>
              <Input
                type="file"
                id="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" variant="secondary">
                Upload
              </Button>
              {statusMessage && (
                <Alert variant="default" className="text-sm">
                  {statusMessage}
                </Alert>
              )}
            </div>
          </form>
        )}
      </div>

      {uploadedData.length > 0 && (
        <div className="mt-6">
            <div className='flex justify-between gap-6'>
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          <Button variant="secondary" onClick={handleInsertAll} className="mb-4">
            Insert All
          </Button>
           </div>
          <ScrollArea className="h-[calc(50vh)] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>City Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((city, index) => (
                    <TableRow key={city.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{city.cityName}</TableCell>
                      <TableCell>{city.country}</TableCell>
                      <TableCell>{city.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2"
            >
              Previous
            </Button>
            {generatePageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? 'default' : 'outline'}
                  className="mx-1"
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="mx-2">
                  ...
                </span>
              )
            )}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
