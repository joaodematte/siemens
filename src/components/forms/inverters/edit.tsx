'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { ComboBox } from '@/components/combo-box';
import { LoadingIcon } from '@/components/loading-icon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateInverterAction } from '@/server/actions/inverter/update-inverter-action';
import { Inverter, Manufacturer, User } from '@/types';

interface InverterWithRelations extends Inverter {
  manufacturer: Manufacturer;
  user: User;
}

interface Props {
  manufacturers: Manufacturer[];
  inverter: InverterWithRelations;
}

const formSchema = z.object({
  model: z.string().min(2, {
    message: 'Campo obrigatório'
  }),
  activePower: z.string().min(1, {
    message: 'Campo obrigatório'
  }),
  manufacturerId: z.string().min(2, {
    message: 'Campo obrigatório'
  })
});

export function EditInverterForm({ manufacturers, inverter }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: inverter.model,
      manufacturerId: inverter.manufacturerId,
      activePower: inverter.activePower.toString()
    }
  });

  const { execute, isPending } = useAction(updateInverterAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      router.push('/dashboard/inverters');
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const onActivePowerChange = (value: string) => {
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      return;
    }

    form.setValue('activePower', value);
  };

  const parsedManufacturers = useMemo(
    () =>
      manufacturers.map((manufacturer) => ({
        value: manufacturer.id,
        label: manufacturer.name
      })),
    [manufacturers]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          execute({
            ...data,
            id: inverter.id,
            activePower: Number(data.activePower)
          })
        )}
        className="grid grid-cols-2 gap-4 lg:max-w-2xl"
      >
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufacturerId"
          render={({ field }) => (
            <FormItem className="block">
              <FormLabel>Fabricante</FormLabel>
              <FormControl>
                <ComboBox
                  placeholder="Selecione..."
                  onChange={field.onChange}
                  value={field.value}
                  data={parsedManufacturers}
                  canCreate
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activePower"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Potência Ativa (W)</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  onChange={(e) => onActivePowerChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="col-span-2">
          <FormLabel>Criado por</FormLabel>
          <FormControl>
            <Input
              disabled
              value={`${inverter.user.name} ${inverter.user.lastName}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Criado em</FormLabel>
          <FormControl>
            <Input
              disabled
              value={inverter.createdAt.toLocaleDateString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Atualizado em</FormLabel>
          <FormControl>
            <Input
              disabled
              value={inverter.updatedAt.toLocaleDateString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="col-span-2" disabled={isPending}>
          {isPending ?
            <LoadingIcon className="h-4 w-4" />
          : 'Confirmar'}
        </Button>
      </form>
    </Form>
  );
}
