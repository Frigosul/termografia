
export const generateDataMode = {
  n1: 'Nível 1',
  n2: 'Nível 2',
  n3: 'Nível 3',
} as const


export type GenerateDataModeType = keyof typeof generateDataMode
