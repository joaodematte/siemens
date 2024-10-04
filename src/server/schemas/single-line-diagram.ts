import { z } from 'zod';

export const createSchema = z
  .object({
    company: z.enum(['celesc', 'dcelt']),
    consumerUnit: z.string().min(1, 'Campo obrigatório'),
    circuitBreakerCapacity: z.string().min(1, 'Campo obrigatório'),
    connectionType: z.enum(['single', 'two', 'three']),
    panelsAmount: z.string().min(1, 'Campo obrigatório'),
    panelModel: z.string().min(1, 'Campo obrigatório'),
    panelPower: z.string().min(1, 'Campo obrigatório'),
    invertersQuantity: z.enum(['one', 'two']),
    firstInverterModel: z.string().min(1, 'Campo obrigatório'),
    secondInverterModel: z.string().optional(),
    firstInverterPanelsAmount: z.string().optional(),
    secondInverterPanelsAmount: z.string().optional()
  })
  .refine(
    ({ invertersQuantity, secondInverterModel }) =>
      invertersQuantity === 'one' || secondInverterModel !== undefined,
    {
      message: 'Campo obrigatório',
      path: ['secondInverterModel']
    }
  )
  .refine(
    ({ invertersQuantity, firstInverterPanelsAmount }) => {
      return (
        invertersQuantity === 'one' || firstInverterPanelsAmount !== undefined
      );
    },
    {
      message: 'Campo obrigatório',
      path: ['firstInverterPanelsAmount']
    }
  )
  .refine(
    ({ invertersQuantity, secondInverterPanelsAmount }) => {
      return (
        invertersQuantity === 'one' || secondInverterPanelsAmount !== undefined
      );
    },
    {
      message: 'Campo obrigatório',
      path: ['secondInverterPanelsAmount']
    }
  )
  .refine(
    ({
      invertersQuantity,
      firstInverterPanelsAmount,
      secondInverterPanelsAmount,
      panelsAmount
    }) => {
      if (invertersQuantity !== 'one') {
        const firstAmount = Number(firstInverterPanelsAmount);
        const secondAmount = Number(secondInverterPanelsAmount);
        const totalPanels = Number(panelsAmount);

        return firstAmount + secondAmount === totalPanels;
      }

      return true;
    },
    {
      message:
        'Soma dos módulos do Inversor 1 e Inversor 2 precisam ser igual a quantidade de módulos',
      path: ['secondInverterPanelsAmount']
    }
  );
