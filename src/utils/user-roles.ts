export const userRoles = {
  adm: 'Administrador',
  level1: 'Nível 1',
  level2: 'Nível 2',
} as const

export type UserRolesType = keyof typeof userRoles
