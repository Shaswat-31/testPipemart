'use client';
import { WordPressSite } from '@/types/ApiRespose';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<WordPressSite>[] = [
  
  {
    accessorKey: 'slug',
    header: 'SLUG'
  },
  { 
    accessorKey: 'url',
    header: 'URL'
  },
  {
    accessorKey: 'country',
    header: 'COUNTRY'
  },
  {
    accessorKey: 'language',
    header: 'LANGUAGE'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
