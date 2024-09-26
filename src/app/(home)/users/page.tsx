import { CreateUser } from './components/create-user'
import { ListUsers } from './components/list-users'

export default function Users() {
  return (
    <main className="px-8 gap-2 flex-grow">
      <div className="flex justify-between items-center w-full my-4">
        <h2 className="font-normal tracking-tight text-foreground ">
          Gerencie usuários Termografia
        </h2>
        <CreateUser />
      </div>
      <ListUsers />
    </main>
  )
}
