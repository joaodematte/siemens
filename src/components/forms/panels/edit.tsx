'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { ComboBox } from '@/components/combo-box';
import { LoadingIcon } from '@/components/loading-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updatePanelAction } from '@/server/actions/panel/update-panel-action';
import { createSchema } from '@/server/schemas/panel';
import { Manufacturer, Panel } from '@/server/supabase/types';

interface Props {
  manufacturers: Manufacturer[];
  panel: Panel | null;
}

export function EditPanelForm({ manufacturers, panel }: Props) {
  const router = useRouter();

  const [powerInput, setPowerInput] = useState('');

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      model: panel?.model ?? '',
      // @ts-expect-error cant type it right now, todo
      manufacturer: panel?.manufacturer.name ?? '',
      power: panel?.power ? JSON.parse(panel.power) : []
    }
  });

  const { execute, isPending } = useAction(updatePanelAction, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      router.push('/panels');
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

  const handlePowerChange = (value: string) => {
    if (value.endsWith(',')) {
      const power = Number(value.slice(0, -1));
      const powerInForm = form.getValues('power');

      if (!powerInForm.includes(power)) form.setValue('power', [...powerInForm, power]);

      setPowerInput('');
      return;
    }

    setPowerInput(value);
  };

  const handleRemovePower = (power: number) => {
    const powerInForm = form.getValues('power');

    form.setValue(
      'power',
      powerInForm.filter((p) => p !== power)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (!panel) return;

          execute({ ...data, id: panel.id });
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
            <FormItem>
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
          name="power"
          render={() => (
            <FormItem className="col-span-2">
              <FormLabel>Potências (W)</FormLabel>
              <FormControl>
                <Input autoComplete="off" value={powerInput} onChange={(e) => handlePowerChange(e.target.value)} />
              </FormControl>
              <FormDescription>Separe-as por vírgula </FormDescription>
              <FormMessage />
              <div className="flex items-center gap-1">
                {form.getValues('power').map((power) => (
                  <Badge key={power} className="flex items-center gap-1">
                    <span>{power}W</span> <button onClick={() => handleRemovePower(power)}>x</button>
                  </Badge>
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormItem className="col-span-2">
          <FormLabel>Criado por</FormLabel>
          <FormControl>
            <Input
              disabled
              // @ts-expect-error cant type it right now, todo
              value={`${panel?.profile?.first_name} ${panel?.profile?.last_name}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Criado em</FormLabel>
          <FormControl>
            <Input
              disabled
              value={new Date(panel?.created_at ?? '').toLocaleDateString('pt-BR', {
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
              value={new Date(panel?.updated_at ?? '').toLocaleDateString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
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
