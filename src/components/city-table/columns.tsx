'use client';
import { City } from '@/types/ApiRespose';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<City>[] = [

  {
    accessorKey: 'cityName',
    header: 'City Name'
  },
  {
    accessorKey: 'state',
    header: 'State'
  },
  {
    accessorKey: 'postalCode',
    header: 'Postal Code'
  }
];
