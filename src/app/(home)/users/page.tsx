import { CreateUser } from './components/create-user'
import { ListUsers } from './components/list-users'

export default function Users() {
  return (
    <main className="px-8 gap-2 h-screen  w-screen lg:w-full lg:flex-grow">
      <div className="flex justify-between items-center w-full my-4">
        <h2 className="font-normal tracking-tight text-foreground text-sm md:text-base">
          Gerencie usuários Termografia
        </h2>
        <CreateUser />
      </div>
      <ListUsers />
    </main>
  )
}
