'use server';

import { promises as fs } from 'fs';
import path from 'path';
import fontkit from '@pdf-lib/fontkit';
import { revalidateTag } from 'next/cache';
import { PDFDocument } from 'pdf-lib';
import { z } from 'zod';

import { authActionClient } from '@/server/actions/safe-action';
import { createSchema } from '@/server/schemas/single-line-diagram';
import { Inverter, Panel } from '@/server/supabase/types';

type Position = [number, number];

interface Positions {
  [key: string]: {
    [key: string]: {
      consumerUnit: Position;
      circuitBreakerCapacity: Position;
      inverter: Position;
      inverterManufacturerName: Position;
      inverterModel: Position;
      panelText: Position;
      panelModel: Position;
      panelPower: Position;
      nominalPower: Position;
      panelsPower: Position;
    };
  };
}

const textPositions: Positions = {
  celesc: {
    single: {
      consumerUnit: [375, 455],
      circuitBreakerCapacity: [393, 384],
      inverter: [470, 190],
      inverterManufacturerName: [470, 178],
      inverterModel: [470, 166],
      panelText: [335, 75],
      panelModel: [335, 63],
      panelPower: [335, 51],
      nominalPower: [550, 64],
      panelsPower: [550, 52]
    },
    two: {
      consumerUnit: [397, 455],
      circuitBreakerCapacity: [415, 384],
      inverter: [492, 190],
      inverterManufacturerName: [492, 178],
      inverterModel: [492, 166],
      panelText: [357, 75],
      panelModel: [357, 63],
      panelPower: [357, 51],
      nominalPower: [572, 64],
      panelsPower: [572, 52]
    },
    three: {
      consumerUnit: [382, 457],
      circuitBreakerCapacity: [400, 386],
      inverter: [477, 192],
      inverterManufacturerName: [477, 180],
      inverterModel: [477, 168],
      panelText: [342, 77],
      panelModel: [342, 65],
      panelPower: [342, 53],
      nominalPower: [557, 66],
      panelsPower: [557, 54]
    }
  },
  dcelt: {
    single: {
      consumerUnit: [352, 453],
      circuitBreakerCapacity: [370, 384],
      inverter: [292, 188],
      inverterManufacturerName: [292, 176],
      inverterModel: [292, 164],
      panelText: [302, 78],
      panelModel: [302, 66],
      panelPower: [302, 55],
      nominalPower: [514, 62],
      panelsPower: [514, 50]
    },
    two: {
      consumerUnit: [367, 455],
      circuitBreakerCapacity: [385, 386],
      inverter: [307, 190],
      inverterManufacturerName: [307, 178],
      inverterModel: [307, 166],
      panelText: [317, 80],
      panelModel: [317, 68],
      panelPower: [317, 57],
      nominalPower: [529, 64],
      panelsPower: [529, 52]
    },
    three: {
      consumerUnit: [250, 455],
      circuitBreakerCapacity: [268, 386.5],
      inverter: [190, 190],
      inverterManufacturerName: [190, 178],
      inverterModel: [190, 166],
      panelText: [200, 80],
      panelModel: [200, 68],
      panelPower: [200, 56],
      nominalPower: [412, 64],
      panelsPower: [412, 52]
    }
  }
};

async function getPdfFile({
  company,
  connectionType
}: Pick<z.infer<typeof createSchema>, 'company' | 'connectionType'>) {
  return fs.readFile(
    path.join(process.cwd(), 'assets', `${company}-${connectionType}.pdf`)
  );
}

async function getFontFile() {
  return fs.readFile(path.join(process.cwd(), 'assets', 'calibri.ttf'));
}

async function generatePdf(
  data: z.infer<typeof createSchema> & { panel: Panel; inverter: Inverter }
) {
  const FONT_SIZE = 12;

  const [pdfFile, fontFile] = await Promise.all([
    getPdfFile({ company: data.company, connectionType: data.connectionType }),
    getFontFile()
  ]);

  const pdfDoc = await PDFDocument.load(pdfFile);

  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(fontFile);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const positions = textPositions[data.company][data.connectionType];

  // Consumer Unit -- START
  page.drawText(`Medidor\n${data.consumerUnit}`, {
    font,
    size: FONT_SIZE,
    x:
      positions.consumerUnit[0] -
      font.widthOfTextAtSize(data.consumerUnit, FONT_SIZE),
    y: positions.consumerUnit[1],
    lineHeight: FONT_SIZE
  });
  // Consumer Unit -- END

  // Circuit Breaker Capacity -- START
  page.drawText(`${data.circuitBreakerCapacity}A`, {
    font,
    size: FONT_SIZE,
    x: positions.circuitBreakerCapacity[0],
    y: positions.circuitBreakerCapacity[1]
  });
  // Circuit Breaker Capacity -- END

  // Inverter -- START
  page.drawText('Inversor', {
    font,
    size: FONT_SIZE,
    x:
      positions.inverter[0] - font.widthOfTextAtSize('Inversor', FONT_SIZE) / 2,
    y: positions.inverter[1],
    lineHeight: FONT_SIZE
  });

  // @ts-expect-error -- TODO: Fix this
  page.drawText(data.inverter.manufacturer.name, {
    font,
    size: FONT_SIZE,
    x:
      positions.inverterManufacturerName[0] -
      // @ts-expect-error -- TODO: Fix this
      font.widthOfTextAtSize(data.inverter.manufacturer.name, FONT_SIZE) / 2,
    y: positions.inverterManufacturerName[1],
    lineHeight: FONT_SIZE
  });

  page.drawText(data.inverterModel, {
    font,
    size: FONT_SIZE,
    x:
      positions.inverterModel[0] -
      font.widthOfTextAtSize(data.inverterModel, FONT_SIZE) / 2,
    y: positions.inverterModel[1],
    lineHeight: FONT_SIZE
  });
  // Inverter -- END

  // Panel -- START
  // @ts-expect-error -- TODO: Fix this
  page.drawText(`Módulo ${data.panel.manufacturer.name}`, {
    font,
    size: FONT_SIZE,
    x:
      positions.panelText[0] -
      font.widthOfTextAtSize(
        // @ts-expect-error -- TODO: Fix this
        `Módulo ${data.panel.manufacturer.name}`,
        FONT_SIZE
      ) /
        2,
    y: positions.panelText[1],
    lineHeight: FONT_SIZE
  });

  page.drawText(data.panelModel, {
    font,
    size: FONT_SIZE,
    x:
      positions.panelModel[0] -
      font.widthOfTextAtSize(data.panelModel, FONT_SIZE) / 2,
    y: positions.panelModel[1],
    lineHeight: FONT_SIZE
  });

  const panelPowerString = `${data.panelsAmount}x${data.panelPower}Wp`;

  page.drawText(panelPowerString, {
    font,
    size: FONT_SIZE,
    x:
      positions.panelPower[0] -
      font.widthOfTextAtSize(panelPowerString, FONT_SIZE) / 2,
    y: positions.panelPower[1],
    lineHeight: FONT_SIZE
  });
  // Panel -- END

  // Nominal Power -- START
  const inverterPower = `Inversor = ${data.inverter.active_power}W`;

  page.drawText(inverterPower, {
    font,
    size: FONT_SIZE,
    x:
      positions.nominalPower[0] -
      font.widthOfTextAtSize(inverterPower, FONT_SIZE) / 2,
    y: positions.nominalPower[1],
    lineHeight: FONT_SIZE
  });

  const panelPower = Number(data.panelPower) * Number(data.panelsAmount);

  page.drawText(`Módulos = ${panelPower}Wp`, {
    font,
    size: FONT_SIZE,
    x:
      positions.panelsPower[0] -
      font.widthOfTextAtSize(`Módulos = ${panelPower}Wp`, FONT_SIZE) / 2,
    y: positions.panelsPower[1],
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

    const buffer = await generatePdf({
      ...parsedInput,
      panel,
      inverter
    });

    revalidateTag('single-line-diagram');
    revalidateTag(`single_line_diagram_${singleLineDiagram.id}`);

    return {
      success: true,
      message: 'Diagrama Unifilar Simplificado criado com sucesso.',
      file: {
        buffer,
        name: `${singleLineDiagram.id}.pdf`
      }
    };
  });
