'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { updateSchema } from '@/server/schemas/panel';

export const updatePanelAction = authActionClient
  .schema(updateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, model, power, manufacturer } = parsedInput;

    const { data: existingPanel } = await ctx.supabase
      .from('panel')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingPanel) {
      throw new Error('Painel não encontrado.');
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
      .update({
        model,
        power: JSON.stringify(power),
        manufacturer_id: manufacturerId
      })
      .eq('id', id);

      revalidateTag('panels');
      revalidateTag(`panel_${id}`);

    return {
      success: true,
      message: 'Painel atualizado com sucesso.'
    };
  });
