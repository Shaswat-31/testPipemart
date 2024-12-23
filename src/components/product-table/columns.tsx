'use client';
import { Product } from '@/types/ApiRespose';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Product>[] = [

  {
    accessorKey: 'productName',
    header: 'Product Name'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'wordpress',
    header: 'WordPress ID'
  },

];
