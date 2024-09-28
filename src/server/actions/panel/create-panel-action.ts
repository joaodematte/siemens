'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { createSchema } from '@/server/schemas/panel';

export const createPanelAction = authActionClient
  .schema(createSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { model, power, manufacturer } = parsedInput;

    const { data: existingPanel } = await ctx.supabase
      .from('panel')
      .select('*')
      .eq('model', model)
      .throwOnError();

    if (existingPanel && existingPanel.length > 0) {
      throw new Error('Painel já cadastrado.');
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
          type: 'panel'
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
      .from('panel')
      .insert({
        model,
        power: JSON.stringify(power),
        manufacturer_id: manufacturerId
      })
      .throwOnError();

    revalidatePath('/panels');

    return {
      success: true,
      message: 'Painel criado com sucesso.'
    };
  });
