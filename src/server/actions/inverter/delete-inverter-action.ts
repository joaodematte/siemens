'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { deleteSchema } from '@/server/schemas/inverter';

export const deleteInverterAction = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;

    const { data: inverter } = await ctx.supabase
      .from('inverter')
      .select('*')
      .eq('id', id)
      .single();

    if (!inverter) {
      throw new Error('Inversor não encontrado.');
    }

    const { error } = await ctx.supabase.from('inverter').delete().eq('id', id);

    if (error) {
      throw new Error('Erro ao deletar o inversor.');
    }

    revalidatePath('/inverters');

    return {
      message: 'Inversor deletado com sucesso.'
    };
  });
