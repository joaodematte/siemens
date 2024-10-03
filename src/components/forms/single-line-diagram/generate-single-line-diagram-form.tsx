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
import { createSchema } from '@/server/schemas/single-line-diagram';
import { Inverter, Panel } from '@/server/supabase/types';

interface Props {
  panels: Panel[] | null;
  inverters: Inverter[] | null;
}

export function GenerateSingleLineDiagramForm({ panels, inverters }: Props) {
  const { downloadFile, isDownloading } = useFileDownload();

  const { execute, isPending } = useAction(createSingleLineDiagram, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      if (data?.file) {
        downloadFile(data.file.buffer, data.file.name);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError);
    }
  });

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      company: 'celesc',
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

    form.setValue(name as keyof z.infer<typeof createSchema>, numericValue);
  };

  useEffect(() => {
    form.setValue('panelPower', '');
  }, [panelModel, form]);

  const isLoading = isPending || isDownloading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(execute)}
        className="grid gap-4 md:max-w-2xl md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Companhia</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celesc" defaultChecked>
                      CELESC
                    </SelectItem>
                    <SelectItem value="dcelt">DCELT</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

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
            <FormItem className="md:col-span-2">
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

        <div className="flex flex-col gap-1 md:col-span-2">
          <Button type="submit" className="md:col-span-2" disabled={isLoading}>
            {isLoading ? <LoadingIcon className="h-4 w-4" /> : 'Gerar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="md:col-span-2"
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
