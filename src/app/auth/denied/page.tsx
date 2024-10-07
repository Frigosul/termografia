import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6">Acesso restrito</h1>
      <p className="text-base text-foreground mb-10">
        Você não tem permissão para prosseguir
      </p>
      <Button className="p-4">
        <Link href="/">Voltar</Link>
      </Button>
    </div>
  )
}
