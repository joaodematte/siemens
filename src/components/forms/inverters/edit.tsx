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
import { updateSchema } from '@/server/schemas/inverter';
import { Inverter, Manufacturer } from '@/server/supabase/types';

interface Props {
  manufacturers: Manufacturer[];
  inverter: Inverter | null;
}

const updateSchemaOmitted = updateSchema.omit({ id: true });

export function EditInverterForm({ manufacturers, inverter }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateSchemaOmitted>>({
    resolver: zodResolver(updateSchemaOmitted),
    defaultValues: {
      model: inverter?.model,
      // @ts-expect-error cant type it right now, todo
      manufacturer: inverter?.manufacturer.name,
      activePower: inverter?.active_power.toString()
    }
  });

  const { execute, isPending } = useAction(updateInverterAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      router.push('/inverters');
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const parsedManufacturers = useMemo(
    () =>
      manufacturers.map((manufacturer) => ({
        value: manufacturer.name,
        label: manufacturer.name
      })),
    [manufacturers]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (!inverter) return;

          execute({ ...data, id: inverter.id });
        })}
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
          name="manufacturer"
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
                  onChange={(e) =>
                    field.onChange(e.target.value.replace(/[^0-9]/g, ''))
                  }
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
              // @ts-expect-error cant type it right now, todo
              value={`${inverter?.profile?.first_name} ${inverter?.profile?.last_name}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Criado em</FormLabel>
          <FormControl>
            <Input
              disabled
              value={new Date(inverter?.created_at ?? '').toLocaleDateString(
                'pt-BR',
                {
                  hour: '2-digit',
                  minute: '2-digit'
                }
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Atualizado em</FormLabel>
          <FormControl>
            <Input
              disabled
              value={new Date(inverter?.updated_at ?? '').toLocaleDateString(
                'pt-BR',
                {
                  hour: '2-digit',
                  minute: '2-digit'
                }
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button type="submit" className="col-span-2" disabled={isPending}>
          {isPending ? <LoadingIcon className="h-4 w-4" /> : 'Confirmar'}
        </Button>
      </form>
    </Form>
  );
}
