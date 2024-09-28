'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo } from 'react';
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
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useFileDownload } from '@/hooks/useFileDownload';
import { createSingleLineDiagram } from '@/server/actions/single-line-diagram/create-single-line-diagram';
import { Inverter, Panel } from '@/server/supabase/types';

const formSchema = z.object({
  consumerUnit: z.string().min(1),
  circuitBreakerCapacity: z.string().min(1),
  connectionType: z.enum(['single', 'two', 'three']),
  panelsAmount: z.string().min(1),
  panelModel: z.string().min(1),
  panelPower: z.string().min(1),
  inverterModel: z.string().min(1)
});

interface Props {
  panels: Panel[] | null;
  inverters: Inverter[] | null;
}

export function GenerateSingleLineDiagramForm({ panels, inverters }: Props) {
  const { downloadFile, isDownloading } = useFileDownload();

  const { execute, isPending } = useAction(createSingleLineDiagram, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      console.log(data);

      if (data?.signedUrl) {
        downloadFile(data.signedUrl);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      connectionType: 'single',
      consumerUnit: '',
      circuitBreakerCapacity: '',
      panelsAmount: '',
      panelModel: '',
      panelPower: '',
      inverterModel: ''
    }
  });

  const parsedPanels = useMemo(
    () =>
      panels?.map((panel) => ({
        value: panel.model,
        label: panel.model
      })),
    [panels]
  );

  const parsedInverters = useMemo(
    () =>
      inverters?.map((inverter) => ({
        value: inverter.model,
        label: inverter.model
      })),
    [inverters]
  );

  const panelModel = form.watch('panelModel');

  const selectedPanel = useMemo(
    () => panels?.find((panel) => panel.model === panelModel),
    [panelModel, panels]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');

    form.setValue(name as keyof z.infer<typeof formSchema>, numericValue);
  };

  useEffect(() => {
    form.setValue('panelPower', '');
  }, [panelModel, form]);

  const isLoading = isPending || isDownloading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(execute)}
        className="grid grid-cols-2 gap-4 lg:max-w-2xl"
      >
        <FormField
          control={form.control}
          name="consumerUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade Consumidora</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="circuitBreakerCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade do Disjuntor (A)</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connectionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Ligação</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single" defaultChecked>
                    Monofásica
                  </SelectItem>
                  <SelectItem value="two">Bifásica</SelectItem>
                  <SelectItem value="three">Trifásica</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="panelsAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Módulos</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="panelModel"
          render={({ field }) => (
            <FormItem className="block">
              <FormLabel>Modelo do Painel</FormLabel>
              <FormControl>
                <ComboBox
                  placeholder="Selecione..."
                  onChange={field.onChange}
                  value={field.value}
                  data={parsedPanels ?? []}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="panelPower"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potência dos Painéis</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedPanel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {selectedPanel &&
                    JSON.parse(selectedPanel?.power).map((power: number) => (
                      <SelectItem key={power} value={power.toString()}>
                        {power}W
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inverterModel"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Modelo do Inversor</FormLabel>
              <FormControl>
                <ComboBox
                  placeholder="Selecione..."
                  onChange={field.onChange}
                  value={field.value}
                  data={parsedInverters ?? []}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="col-span-2 flex flex-col gap-1">
          <Button type="submit" className="col-span-2" disabled={isLoading}>
            {isLoading ?
              <LoadingIcon className="h-4 w-4" />
            : 'Gerar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="col-span-2"
            disabled={isLoading}
            onClick={() => {
              form.reset();
            }}
          >
            Limpar
          </Button>
        </div>
      </form>
    </Form>
  );
}
