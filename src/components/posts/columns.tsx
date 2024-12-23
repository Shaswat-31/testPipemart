'use client';
import { Post } from '@/types/Post';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Post>[] = [

  {
    accessorKey: 'id',
    header: 'Id'
  },
  {
    accessorKey: 'slug',
    header: 'Slug'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'template',
    header: 'Template'
  }
];
