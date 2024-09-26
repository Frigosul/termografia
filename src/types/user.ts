export interface User {
  id: string
  name: string
  userRole: 'Administrador' | 'Nível 1' | 'Nível 2'
  email: string
  password: string
}
