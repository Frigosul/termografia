import { CreateUser } from './components/create-user'
import { ListUsers } from './components/list-users'

export default function Users() {
  return (

    <main className="overflow-hidden px-8 gap-2 flex-1  lg:max-w-6xl lg:mx-auto lg:flex-grow">
      <div className="flex justify-between items-center w-full my-4">
        <h2 className="font-normal tracking-tight text-foreground text-sm md:text-base">
          Gerenciar usuários
        </h2>
        <CreateUser />
      </div>
      <ListUsers />
    </main>

  )
}
