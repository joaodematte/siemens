'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { authActionClient } from '@/server/actions/safe-action';
import { deleteSchema } from '@/server/schemas/panel';

export const deletePanelAction = authActionClient
  .schema(deleteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id } = parsedInput;

    const { data: panel } = await ctx.supabase
      .from('panel')
      .select('*')
      .eq('id', id)
      .single();

    if (!panel) {
      throw new Error('Painel não encontrado.');
    }

    const { error } = await ctx.supabase.from('panel').delete().eq('id', id);

    if (error) {
      throw new Error('Erro ao deletar o painel.');
    }

    revalidateTag('panels');
    revalidateTag(`panel_${id}`);

    return {
      message: 'Painel deletado com sucesso.'
    };
  });
