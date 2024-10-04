'use client';

import { ComboBox } from '@/components/combo-box';
import { LoadingIcon } from '@/components/loading-icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useFileDownload } from '@/hooks/useFileDownload';
import { cn } from '@/lib/utils';
import { createSingleLineDiagram } from '@/server/actions/single-line-diagram/create-single-line-diagram';
import { createSchema } from '@/server/schemas/single-line-diagram';
import { Inverter, Panel } from '@/server/supabase/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface Props {
  panels: Panel[] | null;
  inverters: Inverter[] | null;
}

export function GenerateSingleLineDiagramForm({ panels, inverters }: Props) {
  const { downloadFile, isDownloading } = useFileDownload();

  const [pdfName, setPdfName] = useState('');
  const [base64PDF, setBase64PDF] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    iframeRef.current.src = 'data:application/pdf;base64,' + base64PDF;
  }, [base64PDF, iframeRef.current]);

  const { execute, isPending } = useAction(createSingleLineDiagram, {
    onSuccess: ({ data }) => {
      toast.success(data?.message);

      if (data?.file) {
        // downloadFile(data.file.buffer, data.file.name);
        setBase64PDF(Buffer.from(data.file.buffer).toString('base64'));
        setPdfName(data.file.name);
        setIsViewerOpen(true);
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
      invertersQuantity: 'one',
      firstInverterModel: '',
      secondInverterModel: undefined,
      firstInverterPanelsAmount: undefined,
      secondInverterPanelsAmount: undefined
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

  const invertersQuantity = form.watch('invertersQuantity');
  const hasTwoInverters = invertersQuantity === 'two';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(execute)}
        className="grid grid-cols-1 gap-4 md:max-w-2xl md:grid-cols-2"
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="col-span-2 my-4" />

        <FormField
          control={form.control}
          name="invertersQuantity"
          render={() => (
            <FormItem className="col-span-2 grid">
              <FormLabel>Quantidade de Inversores</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 w-full gap-4 h-12">
                  <button
                    type="button"
                    className={cn(
                      'border-border border rounded-md focus-visible:outline-primary transition-colors duraiton-200 hover:bg-accent',
                      invertersQuantity === 'one' && 'border-primary border-4'
                    )}
                    onClick={() => {
                      form.setValue('invertersQuantity', 'one');
                      form.setValue('secondInverterModel', undefined);
                      form.setValue('firstInverterPanelsAmount', undefined);
                      form.setValue('secondInverterPanelsAmount', undefined);
                    }}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'border-border border rounded-md focus-visible:outline-primary transition-colors duraiton-200 hover:bg-accent',
                      hasTwoInverters && 'border-primary border-4'
                    )}
                    onClick={() => {
                      form.setValue('invertersQuantity', 'two');
                    }}
                  >
                    2
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <FormField
            control={form.control}
            name="firstInverterModel"
            render={({ field }) => (
              <FormItem className={cn(!hasTwoInverters && 'md:col-span-2')}>
                <FormLabel>Modelo do Inversor 1</FormLabel>
                <FormControl>
                  <ComboBox
                    placeholder="Selecione..."
                    onChange={field.onChange}
                    value={field.value}
                    data={parsedInverters ?? []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasTwoInverters && (
            <FormField
              control={form.control}
              name="firstInverterPanelsAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Módulos no Inversor 1</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      {...field}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {hasTwoInverters && (
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <FormField
              control={form.control}
              name="secondInverterModel"
              render={({ field }) => (
                <FormItem className={cn(!hasTwoInverters && 'md:col-span-2')}>
                  <FormLabel>Modelo do Inversor 2</FormLabel>
                  <FormControl>
                    <ComboBox
                      placeholder="Selecione..."
                      onChange={field.onChange}
                      value={field.value ?? ''}
                      data={parsedInverters ?? []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {hasTwoInverters && (
              <FormField
                control={form.control}
                name="secondInverterPanelsAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Módulos no Inversor 2</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        {...field}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        )}

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

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="w-full h-[900px] max-w-7xl pt-12 flex flex-col">
          <iframe ref={iframeRef} width="100%" height="100%" className="grow" />
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsViewerOpen(false);
                setBase64PDF('');
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsViewerOpen(false);
                downloadFile(base64PDF, pdfName);
                setPdfName('');
                setBase64PDF('');
              }}
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
