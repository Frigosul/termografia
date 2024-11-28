import { CreateUser } from './components/create-user'
import { ListUsers } from './components/list-users'

export default function Users() {
  return (
    <main className="overflow-hidden flex-1 flex flex-col p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center w-full my-4 max-w-screen-2xl">
        <h2 className="font-normal tracking-tight text-foreground text-sm md:text-base">
          Gerenciar usuários
        </h2>
        <CreateUser />
      </div>
      <ListUsers />
    </main>
  )
}
