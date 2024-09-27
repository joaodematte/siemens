'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { createSchema } from '@/server/schemas/inverter/create-schema';

export const createInverterAction = authActionClient
  .schema(createSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { model, activePower, manufacturer } = parsedInput;

    const { data: existingInverter } = await ctx.supabase
      .from('inverter')
      .select('*')
      .eq('model', model)
      .throwOnError();

    if (existingInverter && existingInverter.length > 0) {
      throw new Error('Inversor já cadastrado.');
    }

    const { data: existingManufacturer } = await ctx.supabase
      .from('manufacturer')
      .select('*')
      .eq('name', manufacturer)
      .throwOnError();

    let manufacturerId = existingManufacturer?.at(0)?.id;

    if (!manufacturerId) {
      const { data: createdManufacturer } = await ctx.supabase
        .from('manufacturer')
        .insert({
          name: manufacturer,
          type: 'inverter'
        })
        .select()
        .single()
        .throwOnError();

      manufacturerId = createdManufacturer?.id;
    }

    if (!manufacturerId) {
      throw new Error('Não foi possível criar/encontrar o fabricante.');
    }

    const { data: inverter } = await ctx.supabase
      .from('inverter')
      .insert({
        model,
        active_power: Number(activePower),
        manufacturer_id: manufacturerId
      })
      .select()
      .single()
      .throwOnError();

    revalidatePath('/inverters', 'page');

    return {
      message: 'Inversor criado com sucesso.',
      inverter
    };
  });
