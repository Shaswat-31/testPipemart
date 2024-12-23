"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import V2CityService from "@/service/City";
import { City } from "@/types/ApiRespose";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { columns } from "./columns";
import AddCity from "../dialog/addcity"; // Assuming this is for adding new cities

export const CityClient = () => {
  const data = useSelector((state: RootState) => state.wordpress);
  const ID = data.wordpress_id;

  // Define the query function for fetching cities
  const fetchCities = async () => {
    const response = await V2CityService.getCity({
      wordpressId: ID,
    });
    return response.cities!;
  };

  // Use React Query's useQuery hook to fetch city data
  const {
    data: cities = [],
    isLoading,
    isError,
    error,
  } = useQuery<City[], Error>(["cities", ID], fetchCities);

  // Add the actions column here
  const actionColumn: ColumnDef<City> = {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    header: "Actions",
  };

  // Combine the columns with the actions column
  const allcolumns: ColumnDef<City>[] = [...columns, actionColumn];

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Cities (${cities.length})`}
          description="Manage cities"
        />
        {/* <AddCity setCity={setCity} id={ID} /> If you still need this feature */}
        <AddCity />
      </div>
      <Separator />
      <DataTable searchKey="cityName" columns={allcolumns!} data={cities} />
    </>
  );
};
