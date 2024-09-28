'use server';

import { promises as fs } from 'fs';
import fontkit from '@pdf-lib/fontkit';
import { revalidatePath } from 'next/cache';
import { PDFDocument } from 'pdf-lib';
import { z } from 'zod';

import { authActionClient } from '@/server/actions/safe-action';
import { createSchema } from '@/server/schemas/single-line-diagram';
import { Inverter, Panel } from '@/server/supabase/types';

async function generatePdf(
  data: z.infer<typeof createSchema> & { panel: Panel; inverter: Inverter }
) {
  const FONT_SIZE = 12;

  const [pdfFile, fontFile] = await Promise.all([
    fs.readFile('./public/assets/three.pdf'),
    fs.readFile('./public/assets/calibri.ttf')
  ]);

  const pdfDoc = await PDFDocument.load(pdfFile);

  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(fontFile);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  // Consumer Unit -- START
  page.drawText(`Medidor\n${data.consumerUnit}`, {
    font,
    size: FONT_SIZE,
    x: 250 - font.widthOfTextAtSize(data.consumerUnit, FONT_SIZE),
    y: 455,
    lineHeight: FONT_SIZE
  });
  // Consumer Unit -- END

  // Circuit Breaker Capacity -- START
  page.drawText(`${data.circuitBreakerCapacity}A`, {
    font,
    size: FONT_SIZE,
    x: 268,
    y: 386.5
  });
  // Circuit Breaker Capacity -- END

  // Inverter -- START
  page.drawText('Inversor', {
    font,
    size: FONT_SIZE,
    x: 190 - font.widthOfTextAtSize('Inversor', FONT_SIZE) / 2,
    y: 190,
    lineHeight: FONT_SIZE
  });

  // @ts-expect-error -- TODO: Fix this
  page.drawText(data.inverter.manufacturer.name, {
    font,
    size: FONT_SIZE,
    x:
      190 -
      // @ts-expect-error -- TODO: Fix this
      font.widthOfTextAtSize(data.inverter.manufacturer.name, FONT_SIZE) / 2,
    y: 178,
    lineHeight: FONT_SIZE
  });

  page.drawText(data.inverterModel, {
    font,
    size: FONT_SIZE,
    x: 190 - font.widthOfTextAtSize(data.inverterModel, FONT_SIZE) / 2,
    y: 166,
    lineHeight: FONT_SIZE
  });
  // Inverter -- END

  // Panel -- START
  // @ts-expect-error -- TODO: Fix this
  page.drawText(`Módulo ${data.panel.manufacturer.name}`, {
    font,
    size: FONT_SIZE,
    x:
      200 -
      font.widthOfTextAtSize(
        // @ts-expect-error -- TODO: Fix this
        `Módulo ${data.panel.manufacturer.name}`,
        FONT_SIZE
      ) /
        2,
    y: 80,
    lineHeight: FONT_SIZE
  });

  page.drawText(data.panelModel, {
    font,
    size: FONT_SIZE,
    x: 200 - font.widthOfTextAtSize(data.panelModel, FONT_SIZE) / 2,
    y: 68,
    lineHeight: FONT_SIZE
  });

  const panelPowerString = `${data.panelsAmount}x${data.panelPower}Wp`;

  page.drawText(panelPowerString, {
    font,
    size: FONT_SIZE,
    x: 200 - font.widthOfTextAtSize(panelPowerString, FONT_SIZE) / 2,
    y: 56,
    lineHeight: FONT_SIZE
  });
  // Panel -- END

  // Nominal Power -- START
  page.drawText(`Inversor = 3000W`, {
    font,
    size: FONT_SIZE,
    x: 412 - font.widthOfTextAtSize('Inversor = 3000W', FONT_SIZE) / 2,
    y: 64,
    lineHeight: FONT_SIZE
  });

  const panelPower = Number(data.panelPower) * Number(data.panelsAmount);

  page.drawText(`Módulos = ${panelPower}Wp`, {
    font,
    size: FONT_SIZE,
    x: 412 - font.widthOfTextAtSize(`Módulos = ${panelPower}Wp`, FONT_SIZE) / 2,
    y: 52,
    lineHeight: FONT_SIZE
  });
  // Nominal Power -- END

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

export const createSingleLineDiagram = authActionClient
  .schema(createSchema)
  .action(async ({ ctx, parsedInput }) => {
    const {
      consumerUnit,
      circuitBreakerCapacity,
      connectionType,
      panelsAmount,
      panelModel,
      panelPower,
      inverterModel
    } = parsedInput;

    const { data: panel } = await ctx.supabase
      .from('panel')
      .select(
        `
          *,
          manufacturer:manufacturer_id (
            id,
            name
          )
        `
      )
      .eq('model', panelModel)
      .single()
      .throwOnError();

    const { data: inverter } = await ctx.supabase
      .from('inverter')
      .select(
        `
          *,
          manufacturer:manufacturer_id (
            id,
            name
          )
      `
      )
      .eq('model', inverterModel)
      .single()
      .throwOnError();

    if (!panel) {
      throw new Error('Painel não encontrado.');
    }

    if (!inverter) {
      throw new Error('Inversor não encontrado.');
    }

    const { data: singleLineDiagram } = await ctx.supabase
      .from('single_line_diagram')
      .insert({
        consumer_unit: consumerUnit,
        circuit_breaker_capacity: Number(circuitBreakerCapacity),
        connection_type: connectionType,
        panels_amount: Number(panelsAmount),
        panel_model: panelModel,
        panel_power: panelPower,
        inverter_model: inverterModel
      })
      .select('*')
      .single()
      .throwOnError();

    if (!singleLineDiagram) {
      throw new Error(
        'Erro ao criar diagrama unifilar simplificado no banco de dados.'
      );
    }

    const signedUrl = await generatePdf({
      ...parsedInput,
      panel,
      inverter
    }).then(async (pdfBytes) => {
      const fileName = `${singleLineDiagram.id}.pdf`;

      const { error: storageError } = await ctx.supabase.storage
        .from('single_line_diagrams')
        .upload(fileName, pdfBytes);

      if (storageError) {
        throw new Error(
          'Erro ao salvar diagrama unifilar simplificado no storage.'
        );
      }

      const { data: signedUrlData, error: signedUrlError } =
        await ctx.supabase.storage
          .from('single_line_diagrams')
          .createSignedUrl(fileName, 60 * 60);

      if (signedUrlError || !signedUrlData.signedUrl) {
        throw new Error(
          'Erro ao gerar URL de download para o diagrama unifilar simplificado.'
        );
      }

      return signedUrlData.signedUrl;
    });

    revalidatePath('/');

    return {
      success: true,
      message: 'Diagrama Unifilar Simplificado criado com sucesso.',
      signedUrl
    };
  });
