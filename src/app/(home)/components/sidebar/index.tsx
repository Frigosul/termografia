

export function SideBar() {

  return (
    <aside className="flex flex-col h-screen border-r px-4">
      <p className="m-4 text-center text-xl uppercase tracking-tight font-medium">Menu</p>
      <nav className="flex flex-col space-y-2">
        <a className="font-normal text-sm" href="#">Sair</a>
        <a className="font-normal text-sm" href="#">Usuários</a>
        <a className="font-normal text-sm" href="#">Gerar gráfico</a>
        <a className="font-normal text-sm" href="#">Gerenciar dados</a>
        <a className="font-normal text-sm" href="#">Gerenciar padrões</a>
        <a className="font-normal text-sm" href="#">Gerenciar equipamentos</a>
        <a className="font-normal text-sm" href="#">Registro de acessos</a>
        <a className="font-normal text-sm" href="#">Alterar senha</a>
      </nav>
    </aside>
  )
}