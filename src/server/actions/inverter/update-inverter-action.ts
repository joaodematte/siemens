'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { updateSchema } from '@/server/schemas/inverter';

export const updateInverterAction = authActionClient
  .schema(updateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, model, activePower, manufacturer } = parsedInput;

    const { data: existingInverter } = await ctx.supabase
      .from('inverter')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingInverter) {
      throw new Error('Inversor não encontrado.');
    }

    const { data: existingManufacturer } = await ctx.supabase
      .from('manufacturer')
      .select('*')
      .eq('name', manufacturer);

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

    await ctx.supabase
      .from('inverter')
      .update({
        model,
        active_power: Number(activePower),
        manufacturer_id: manufacturerId
      })
      .eq('id', id);

    revalidatePath('/inverters');

    return {
      success: true,
      message: 'Inversor atualizado com sucesso.'
    };
  });
