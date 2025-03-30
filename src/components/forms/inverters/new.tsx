'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { ComboBox } from '@/components/combo-box';
import { LoadingIcon } from '@/components/loading-icon';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createInverterAction } from '@/server/actions/inverter/create-inverter-action';
import { createSchema } from '@/server/schemas/inverter';
import { Manufacturer } from '@/server/supabase/types';

interface Props {
  manufacturers: Manufacturer[];
}

export function NewInverterForm({ manufacturers }: Props) {
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      model: '',
      manufacturer: '',
      activePower: '',
      inmetroCode: ''
    }
  });

  const { execute, isPending } = useAction(createInverterAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      form.reset();
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
      <form onSubmit={form.handleSubmit(execute)} className="grid grid-cols-2 gap-4 lg:max-w-2xl">
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
          name="inmetroCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código INMETRO</FormLabel>
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
            <FormItem className="col-span-2">
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
                  onChange={(e) => field.onChange(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="col-span-2" disabled={isPending}>
          {isPending ? <LoadingIcon className="h-4 w-4" /> : 'Confirmar'}
        </Button>
      </form>
    </Form>
  );
}
