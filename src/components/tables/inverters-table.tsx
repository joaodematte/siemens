'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { User } from '@supabase/supabase-js';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { GenericDataTable } from '@/components/tables/generic-data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Inverter, Manufacturer } from '@/server/supabase/types';

interface Props {
  data: Inverter[];
}

export default function InvertersTable({ data }: Props) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInverterId, setSelectedInverterId] = useState<string | null>(
    null
  );

  // const { execute } = useAction(deleteInverterAction, {
  //   onSuccess: ({ data }) => {
  //     toast.success(data?.message);
  //   },
  //   onError: ({ error }) => {
  //     toast.error(error.serverError);
  //   }
  // });

  const handleDelete = useMemo(
    () => (id: string | null) => {
      // if (!id) return;

      console.log(id);
      // execute({ inverterId: id });
    },
    []
  );

  const columns: ColumnDef<Inverter>[] = useMemo(
    () => [
      {
        accessorKey: 'model',
        header: 'Modelo',
        cell: ({ row }) => (
          <div className="font-semibold capitalize">
            {row.getValue('model')}
          </div>
        )
      },
      {
        accessorKey: 'activePower',
        header: 'Potência Ativa (W)',
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue('activePower')}</div>
        )
      },
      {
        accessorKey: 'manufacturer',
        header: 'Fabricante',
        cell: ({ row }) => {
          const manufacturer = row.getValue<Manufacturer>('manufacturer');
          return <div className="capitalize">{manufacturer.name}</div>;
        }
      },
      {
        accessorKey: 'user',
        header: 'Criado por',
        cell: ({ row }) => {
          const user = row.getValue<User>('user');
          return (
            <div className="capitalize">{user.user_metadata.display_name}</div>
          );
        }
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu
            onOpenChange={() => setSelectedInverterId(row.original.id)}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu de ações</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/inverters/${row.original.id}`)
                }
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [router]
  );

  return (
    <>
      <GenericDataTable
        data={data}
        columns={columns}
        filterColumn="model"
        filterPlaceholder="Filtrar por modelo..."
        addNewLink="/dashboard/inverters/new"
        addNewText="Adicionar Inversor"
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Você tem certeza que deseja excluir este inversor?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(selectedInverterId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
