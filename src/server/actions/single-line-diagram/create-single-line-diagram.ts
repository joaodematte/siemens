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
      [key: string]: {
        consumerUnit: Position;
        circuitBreakerCapacity: Position;
        firstInverter: Position;
        firstInverterManufacturerName: Position;
        firstInverterModel: Position;
        firstInverterInmetroCode: Position;
        secondInverter?: Position;
        secondInverterManufacturerName?: Position;
        secondInverterModel?: Position;
        secondInverterInmetroCode?: Position;
        firstPanelText: Position;
        firstPanelModel: Position;
        firstPanelPower: Position;
        secondPanelText?: Position;
        secondPanelModel?: Position;
        secondPanelPower?: Position;
        nominalPower: Position;
        panelsPower: Position;
      };
    };
  };
}

const textPositions: Positions = {
  celesc: {
    one: {
      single: {
        consumerUnit: [375, 455],
        circuitBreakerCapacity: [393, 384],
        firstInverter: [470, 190],
        firstInverterManufacturerName: [470, 178],
        firstInverterModel: [470, 166],
        firstInverterInmetroCode: [470, 154],
        firstPanelText: [335, 75],
        firstPanelModel: [335, 63],
        firstPanelPower: [335, 51],
        nominalPower: [550, 64],
        panelsPower: [550, 52]
      },
      two: {
        consumerUnit: [397, 455],
        circuitBreakerCapacity: [415, 384],
        firstInverter: [492, 190],
        firstInverterManufacturerName: [492, 178],
        firstInverterModel: [492, 166],
        firstInverterInmetroCode: [492, 154],
        firstPanelText: [357, 75],
        firstPanelModel: [357, 63],
        firstPanelPower: [357, 51],
        nominalPower: [572, 64],
        panelsPower: [572, 52]
      },
      three: {
        consumerUnit: [382, 457],
        circuitBreakerCapacity: [400, 386],
        firstInverter: [477, 192],
        firstInverterManufacturerName: [477, 180],
        firstInverterModel: [477, 168],
        firstInverterInmetroCode: [477, 154],
        firstPanelText: [342, 77],
        firstPanelModel: [342, 65],
        firstPanelPower: [342, 53],
        nominalPower: [557, 66],
        panelsPower: [557, 54]
      }
    },
    two: {
      single: {
        consumerUnit: [367, 455],
        circuitBreakerCapacity: [385, 384],
        firstInverter: [350, 186],
        firstInverterManufacturerName: [350, 174],
        firstInverterModel: [350, 162],
        firstInverterInmetroCode: [350, 150],
        secondInverter: [435, 186],
        secondInverterManufacturerName: [435, 174],
        secondInverterModel: [435, 162],
        secondInverterInmetroCode: [435, 150],
        firstPanelText: [215, 75],
        firstPanelModel: [215, 63],
        firstPanelPower: [215, 51],
        secondPanelText: [440, 75],
        secondPanelModel: [440, 63],
        secondPanelPower: [440, 51],
        nominalPower: [640, 64],
        panelsPower: [640, 52]
      },
      two: {
        consumerUnit: [378, 455],
        circuitBreakerCapacity: [396, 384],
        firstInverter: [361, 186],
        firstInverterManufacturerName: [361, 174],
        firstInverterModel: [361, 162],
        firstInverterInmetroCode: [361, 150],
        secondInverter: [446, 186],
        secondInverterManufacturerName: [446, 174],
        secondInverterModel: [446, 162],
        secondInverterInmetroCode: [446, 150],
        firstPanelText: [226, 75],
        firstPanelModel: [226, 63],
        firstPanelPower: [226, 51],
        secondPanelText: [451, 75],
        secondPanelModel: [451, 63],
        secondPanelPower: [451, 51],
        nominalPower: [651, 64],
        panelsPower: [651, 52]
      },
      three: {
        consumerUnit: [380, 457],
        circuitBreakerCapacity: [400, 386],
        firstInverter: [363, 188],
        firstInverterManufacturerName: [363, 176],
        firstInverterModel: [363, 164],
        firstInverterInmetroCode: [363, 150],
        secondInverter: [449, 188],
        secondInverterManufacturerName: [449, 176],
        secondInverterModel: [449, 164],
        secondInverterInmetroCode: [449, 150],
        firstPanelText: [229, 77],
        firstPanelModel: [229, 65],
        firstPanelPower: [229, 53],
        secondPanelText: [454, 77],
        secondPanelModel: [454, 65],
        secondPanelPower: [454, 53],
        nominalPower: [654, 66],
        panelsPower: [654, 54]
      }
    }
  },
  dcelt: {
    one: {
      single: {
        consumerUnit: [352, 453],
        circuitBreakerCapacity: [370, 384],
        firstInverter: [292, 188],
        firstInverterManufacturerName: [292, 176],
        firstInverterModel: [292, 164],
        firstInverterInmetroCode: [292, 154],
        firstPanelText: [302, 78],
        firstPanelModel: [302, 66],
        firstPanelPower: [302, 55],
        nominalPower: [514, 62],
        panelsPower: [514, 50]
      },
      two: {
        consumerUnit: [367, 455],
        circuitBreakerCapacity: [385, 386],
        firstInverter: [307, 190],
        firstInverterManufacturerName: [307, 178],
        firstInverterModel: [307, 166],
        firstInverterInmetroCode: [307, 154],
        firstPanelText: [317, 80],
        firstPanelModel: [317, 68],
        firstPanelPower: [317, 57],
        nominalPower: [529, 64],
        panelsPower: [529, 52]
      },
      three: {
        consumerUnit: [250, 455],
        circuitBreakerCapacity: [268, 386.5],
        firstInverter: [190, 190],
        firstInverterManufacturerName: [190, 178],
        firstInverterModel: [190, 166],
        firstInverterInmetroCode: [190, 154],
        firstPanelText: [200, 80],
        firstPanelModel: [200, 68],
        firstPanelPower: [200, 56],
        nominalPower: [412, 64],
        panelsPower: [412, 52]
      }
    },
    two: {
      single: {
        consumerUnit: [370, 468],
        circuitBreakerCapacity: [388, 408],
        firstInverter: [358, 170],
        firstInverterManufacturerName: [358, 158],
        firstInverterModel: [358, 146],
        firstInverterInmetroCode: [358, 134],
        secondInverter: [438, 170],
        secondInverterManufacturerName: [438, 158],
        secondInverterModel: [438, 146],
        secondInverterInmetroCode: [438, 134],
        firstPanelText: [240, 75],
        firstPanelModel: [240, 63],
        firstPanelPower: [240, 52],
        secondPanelText: [430, 75],
        secondPanelModel: [430, 63],
        secondPanelPower: [430, 52],
        nominalPower: [600, 62],
        panelsPower: [600, 50]
      },
      two: {
        consumerUnit: [394, 470],
        circuitBreakerCapacity: [410, 410],
        firstInverter: [372, 170],
        firstInverterManufacturerName: [372, 158],
        firstInverterModel: [372, 146],
        firstInverterInmetroCode: [372, 134],
        secondInverter: [458, 170],
        secondInverterManufacturerName: [458, 158],
        secondInverterModel: [458, 146],
        secondInverterInmetroCode: [458, 134],
        firstPanelText: [260, 75],
        firstPanelModel: [260, 63],
        firstPanelPower: [260, 52],
        secondPanelText: [450, 75],
        secondPanelModel: [450, 63],
        secondPanelPower: [450, 52],
        nominalPower: [630, 64],
        panelsPower: [630, 52]
      },
      three: {
        consumerUnit: [389, 470],
        circuitBreakerCapacity: [405, 410],
        firstInverter: [368, 170],
        firstInverterManufacturerName: [368, 158],
        firstInverterModel: [368, 146],
        firstInverterInmetroCode: [368, 134],
        secondInverter: [454, 170],
        secondInverterManufacturerName: [454, 158],
        secondInverterModel: [454, 146],
        secondInverterInmetroCode: [454, 134],
        firstPanelText: [260, 75],
        firstPanelModel: [260, 63],
        firstPanelPower: [260, 52],
        secondPanelText: [450, 75],
        secondPanelModel: [450, 63],
        secondPanelPower: [450, 52],
        nominalPower: [625, 64],
        panelsPower: [625, 52]
      }
    }
  }
};

const cache = new Map<string, Buffer>();

async function getPdfFile(cacheKey: string) {
  const inMemory = cache.get(cacheKey);

  if (inMemory) return inMemory;

  return fs.readFile(path.join(process.cwd(), 'assets', cacheKey));
}

async function getFontFile() {
  const inMemory = cache.get('font');

  if (inMemory) return inMemory;

  return fs.readFile(
    path.join(process.cwd(), 'assets', 'fonts', 'calibri.ttf')
  );
}

async function generatePdf(
  data: z.infer<typeof createSchema> & {
    panel: Panel;
    firstInverter: Inverter;
    secondInverter?: Inverter | null;
  }
) {
  const FONT_SIZE = 12;

  const pdfCacheKey = `${data.company}/${data.invertersQuantity}-inverter/${data.connectionType}.pdf`;

  const [pdfFile, fontFile] = await Promise.all([
    getPdfFile(pdfCacheKey),
    getFontFile()
  ]);

  if (!cache.get(pdfCacheKey)) cache.set(pdfCacheKey, pdfFile);
  if (!cache.get('font')) cache.set('font', fontFile);

  const pdfDoc = await PDFDocument.load(pdfFile);

  pdfDoc.registerFontkit(fontkit);

  const font = await pdfDoc.embedFont(fontFile);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const positions =
    textPositions[data.company][data.invertersQuantity][data.connectionType];

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

  const inverterFontSize = data.secondInverter ? FONT_SIZE - 3 : FONT_SIZE;

  // First Inverter -- START
  page.drawText('Inversor 1', {
    font,
    size: inverterFontSize,
    x:
      positions.firstInverter[0] -
      font.widthOfTextAtSize('Inversor 1', inverterFontSize) / 2,
    y: positions.firstInverter[1],
    lineHeight: inverterFontSize
  });

  // @ts-expect-error -- TODO: Fix this
  page.drawText(data.firstInverter.manufacturer.name, {
    font,
    size: inverterFontSize,
    x:
      positions.firstInverterManufacturerName[0] -
      font.widthOfTextAtSize(
        // @ts-expect-error -- TODO: Fix this
        data.firstInverter.manufacturer.name,
        inverterFontSize
      ) /
        2,
    y: positions.firstInverterManufacturerName[1],
    lineHeight: inverterFontSize
  });

  page.drawText(data.firstInverterModel, {
    font,
    size: inverterFontSize,
    x:
      positions.firstInverterModel[0] -
      font.widthOfTextAtSize(data.firstInverterModel, inverterFontSize) / 2,
    y: positions.firstInverterModel[1],
    lineHeight: inverterFontSize
  });

  if (data.firstInverter.inmetro_code) {
    page.drawText(data.firstInverter.inmetro_code, {
      font,
      size: inverterFontSize,
      x:
        positions.firstInverterInmetroCode[0] -
        font.widthOfTextAtSize(
          data.firstInverter.inmetro_code,
          inverterFontSize
        ) /
          2,
      y: positions.firstInverterInmetroCode[1],
      lineHeight: inverterFontSize
    });
  }
  // First Inverter -- END

  // Second Inverter -- START
  if (
    data.secondInverter &&
    data.secondInverterModel !== undefined &&
    positions.secondInverter &&
    positions.secondInverterManufacturerName &&
    positions.secondInverterModel
  ) {
    page.drawText('Inversor 2', {
      font,
      size: inverterFontSize,
      x:
        positions.secondInverter[0] -
        font.widthOfTextAtSize('Inversor 2', inverterFontSize) / 2,
      y: positions.secondInverter[1],
      lineHeight: inverterFontSize
    });

    // @ts-expect-error -- TODO: Fix this
    page.drawText(data.firstInverter.manufacturer.name, {
      font,
      size: inverterFontSize,
      x:
        positions.secondInverterManufacturerName[0] -
        font.widthOfTextAtSize(
          // @ts-expect-error -- TODO: Fix this
          data.firstInverter.manufacturer.name,
          inverterFontSize
        ) /
          2,
      y: positions.secondInverterManufacturerName[1],
      lineHeight: inverterFontSize
    });

    page.drawText(data.secondInverterModel, {
      font,
      size: inverterFontSize,
      x:
        positions.secondInverterModel[0] -
        font.widthOfTextAtSize(data.secondInverterModel, inverterFontSize) / 2,
      y: positions.secondInverterModel[1],
      lineHeight: inverterFontSize
    });
  }

  if (
    data.secondInverter &&
    data.secondInverter.inmetro_code &&
    positions.secondInverterInmetroCode
  ) {
    page.drawText(data.secondInverter.inmetro_code, {
      font,
      size: inverterFontSize,
      x:
        positions.secondInverterInmetroCode[0] -
        font.widthOfTextAtSize(
          data.secondInverter.inmetro_code,
          inverterFontSize
        ) /
          2,
      y: positions.secondInverterInmetroCode[1],
      lineHeight: inverterFontSize
    });
  }
  // Second Inverter -- END

  // First Panel -- START

  const firstPanelsAmount = data.firstInverterPanelsAmount ?? data.panelsAmount;

  // @ts-expect-error -- TODO: Fix this
  page.drawText(`Módulo ${data.panel.manufacturer.name}`, {
    font,
    size: FONT_SIZE,
    x:
      positions.firstPanelText[0] -
      font.widthOfTextAtSize(
        // @ts-expect-error -- TODO: Fix this
        `Módulo ${data.panel.manufacturer.name}`,
        FONT_SIZE
      ) /
        2,
    y: positions.firstPanelText[1],
    lineHeight: FONT_SIZE
  });

  page.drawText(data.panelModel, {
    font,
    size: FONT_SIZE,
    x:
      positions.firstPanelModel[0] -
      font.widthOfTextAtSize(data.panelModel, FONT_SIZE) / 2,
    y: positions.firstPanelModel[1],
    lineHeight: FONT_SIZE
  });

  const panelPowerString = `${firstPanelsAmount}x${data.panelPower}Wp`;

  page.drawText(panelPowerString, {
    font,
    size: FONT_SIZE,
    x:
      positions.firstPanelPower[0] -
      font.widthOfTextAtSize(panelPowerString, FONT_SIZE) / 2,
    y: positions.firstPanelPower[1],
    lineHeight: FONT_SIZE
  });
  // First Panel -- END

  // Second Panel -- START
  if (
    data.secondInverter &&
    data.secondInverterModel !== undefined &&
    positions.secondPanelText &&
    positions.secondPanelPower &&
    positions.secondPanelModel
  ) {
    // @ts-expect-error -- TODO: Fix this
    page.drawText(`Módulo ${data.panel.manufacturer.name}`, {
      font,
      size: FONT_SIZE,
      x:
        positions.secondPanelText[0] -
        font.widthOfTextAtSize(
          // @ts-expect-error -- TODO: Fix this
          `Módulo ${data.panel.manufacturer.name}`,
          FONT_SIZE
        ) /
          2,
      y: positions.secondPanelText[1],
      lineHeight: FONT_SIZE
    });

    page.drawText(data.panelModel, {
      font,
      size: FONT_SIZE,
      x:
        positions.secondPanelModel[0] -
        font.widthOfTextAtSize(data.panelModel, FONT_SIZE) / 2,
      y: positions.secondPanelModel[1],
      lineHeight: FONT_SIZE
    });

    const panelPowerString = `${data.secondInverterPanelsAmount}x${data.panelPower}Wp`;

    page.drawText(panelPowerString, {
      font,
      size: FONT_SIZE,
      x:
        positions.secondPanelPower[0] -
        font.widthOfTextAtSize(panelPowerString, FONT_SIZE) / 2,
      y: positions.secondPanelPower[1],
      lineHeight: FONT_SIZE
    });
  }
  // Second Panel -- END

  // Nominal Power -- START
  let inverterPower = undefined;

  if (data.secondInverter && data.secondInverterModel !== undefined) {
    inverterPower = `Inversor = ${(data.firstInverter.active_power + data.secondInverter.active_power).toLocaleString('pt-BR')}W`;
  } else {
    inverterPower = `Inversor = ${data.firstInverter.active_power.toLocaleString('pt-BR')}W`;
  }

  page.drawText(inverterPower, {
    font,
    size: FONT_SIZE,
    x:
      positions.nominalPower[0] -
      font.widthOfTextAtSize(inverterPower, FONT_SIZE) / 2,
    y: positions.nominalPower[1],
    lineHeight: FONT_SIZE
  });

  const panelPower = (
    Number(data.panelPower) * Number(data.panelsAmount)
  ).toLocaleString('pt-BR');

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
      firstInverterModel,
      secondInverterModel
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

    const { data: firstInverter } = await ctx.supabase
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
      .eq('model', firstInverterModel)
      .single()
      .throwOnError();

    let secondInverter = undefined;

    if (firstInverterModel === secondInverterModel) {
      secondInverter = firstInverter;
    } else if (secondInverterModel !== undefined) {
      const { data } = await ctx.supabase
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
        .eq('model', secondInverterModel)
        .single()
        .throwOnError();

      secondInverter = data;
    }

    if (!panel) {
      throw new Error('Painel não encontrado.');
    }

    if (!firstInverter) {
      throw new Error('Inversor 1 não encontrado.');
    }

    if (!secondInverter && secondInverterModel !== undefined) {
      throw new Error('Inversor 2 não encontrado.');
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
        first_inverter_model: firstInverterModel,
        second_inverter_model: secondInverterModel
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
      firstInverter,
      secondInverter
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
