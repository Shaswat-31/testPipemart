'use client';
import { AlertModal } from '@/components/model/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import V2ProductService from '@/service/Product';
import { DeleteProductApiResponse, Product } from '@/types/ApiRespose';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from '../ui/use-toast';
import EditProduct from '../dialog/editproduct';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const  {data: session} = useSession();
  
  const  wordpress_id= session?.selectsite.wordpress_id;
  
  const deleteMutation = useMutation({
    mutationFn: () => V2ProductService.deleteProduct({ productid: data.id }),
    onMutate: async () => {
      await queryClient.cancelQueries(['products', wordpress_id]);
  
      const previousProducts = queryClient.getQueryData<Product[]>(['products', wordpress_id]);
  
      queryClient.setQueryData<Product[]>(['products', wordpress_id], old =>
        old?.filter(product => product.id !== data.id) ?? []
      );
  
      return { previousProducts };
    },
    onError: (error: any, _, context: any) => {
      queryClient.setQueryData(['products', wordpress_id], context.previousProducts);
      const errorMessage = error.response?.data?.error?.message || error.message || "An error occurred";
      toast({
        title: "Error deleting product",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: (resData: DeleteProductApiResponse) => {
      if (resData.success) {
        toast({
          title: "Product deleted successfully",
          description: resData.message,
          variant: "default",
        });
        queryClient.invalidateQueries(['products', wordpress_id]); // Ensure this matches the query key
      } else {
        toast({
          title: "Product could not be deleted",
          description: resData.message,
          variant: "destructive",
        });
      }
    },
  });

  const onConfirm = () => {
    deleteMutation.mutate();
    setOpen(false);
  };

  return (
    <>
      <EditProduct
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        data={data}
      />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={deleteMutation.isLoading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
