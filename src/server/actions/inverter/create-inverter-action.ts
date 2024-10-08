'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { createSchema } from '@/server/schemas/inverter';

export const createInverterAction = authActionClient
  .schema(createSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { model, activePower, manufacturer, inmetroCode } = parsedInput;

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

      revalidateTag('manufacturers');

      manufacturerId = createdManufacturer?.id;
    }

    if (!manufacturerId) {
      throw new Error('Não foi possível criar/encontrar o fabricante.');
    }

    await ctx.supabase
      .from('inverter')
      .insert({
        model,
        active_power: Number(activePower),
        manufacturer_id: manufacturerId,
        inmetro_code: inmetroCode
      })
      .throwOnError();

    revalidateTag('inverters');

    return {
      success: true,
      message: 'Inversor criado com sucesso.'
    };
  });
