import { AlterPassword } from './components/alter-password'
import { CreateUser } from './components/create-user'
import { DeleteUser } from './components/delete-user'
import { ListUsers } from './components/list-users'
import { UpdateUser } from './components/update-user'

export default function Users() {
  return (
    <main className="overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center w-full my-4 max-w-screen-2xl">
        <h2 className="font-normal tracking-tight text-foreground text-sm md:text-base">
          Gerenciar usuários
        </h2>
        <CreateUser />
        <AlterPassword />
        <UpdateUser />
        <DeleteUser />
      </div>
      <ListUsers />
    </main>
  )
}
