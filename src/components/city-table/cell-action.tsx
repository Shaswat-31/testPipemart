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
import V2CityService from '@/service/City';
import { City, CityApiResponse } from '@/types/ApiRespose';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  data: City;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const {data: session} = useSession();
  const wordpressId= session?.selectsite.wordpress_id!;

  const deleteMutation = useMutation({
    mutationFn: () => V2CityService.deleteCity({ wordpressId:wordpressId, cityId: data.id }),
    onMutate: async () => {
      await queryClient.cancelQueries(['cities', wordpressId]);

      const previousCities = queryClient.getQueryData<City[]>(['cities', wordpressId]);

      queryClient.setQueryData<City[]>(['cities', wordpressId], old =>
        old?.filter(city => city.id !== data.id) ?? []
      );

      return { previousCities };
    },
    onError: (error: any, _, context: any) => {
      queryClient.setQueryData(['cities', wordpressId], context.previousCities);
      const errorMessage = error.response?.data?.error?.message || error.message || "An error occurred";
      toast({
        title: "Error deleting city",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: (resData: CityApiResponse) => {
      if (resData.success) {
        toast({
          title: "City deleted successfully",
          description: resData.message,
          variant: "default",
        });
        queryClient.invalidateQueries(['cities', wordpressId]);
      } else {
        toast({
          title: "City could not be deleted",
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
