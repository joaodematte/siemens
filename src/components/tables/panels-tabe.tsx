'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

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
import { deletePanelAction } from '@/server/actions/panel/delete-panel-action';
import { Manufacturer, Panel, Profile } from '@/server/supabase/types';

interface Props {
  panels: Panel[];
}

export default function PanelsTable({ panels }: Props) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);

  const { execute } = useAction(deletePanelAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const handleDelete = useMemo(
    () => (id: string | null) => {
      if (!id) return;

      execute({ id });
    },
    []
  );

  const columns: ColumnDef<Panel>[] = useMemo(
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
        accessorKey: 'power',
        header: 'Potência(s) (W)',
        cell: ({ row }) => (
          <div className="capitalize">
            {(JSON.parse(row.getValue<string>('power')) as string[]).join(', ')}
          </div>
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
        accessorKey: 'profile',
        header: 'Criado por',
        cell: ({ row }) => {
          const user = row.getValue<Profile>('profile');

          return (
            <div className="capitalize">
              {user.first_name} {user.last_name}
            </div>
          );
        }
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu
            onOpenChange={() => setSelectedPanelId(row.original.id)}
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
                onClick={() => router.push(`/panels/${row.original.id}`)}
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
        data={panels}
        columns={columns}
        filterColumn="model"
        filterPlaceholder="Filtrar por modelo..."
        addNewLink="/panels/new"
        addNewText="Adicionar Painel"
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Você tem certeza que deseja excluir este painel?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(selectedPanelId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
