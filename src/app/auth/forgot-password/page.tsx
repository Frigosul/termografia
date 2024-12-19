"use client"
import { forgotPassword } from "@/app/actions/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const result = await forgotPassword({ email });

    setIsLoading(false);
    setMessage(result.message);
    setSuccess(result.success)
    if (result.success) {

      setInterval(() => {
        router.push('/sign-in');
      }, 5000)

    } else {
      console.error('Password reset failed:', result.message);
      toast.error(result.message, {
        position: 'top-right',
        icon: <CircleX />,
      })
    }
  };


  return (
    <div className="space-y-2">
      <h2 className="text-xl tracking-tight text-center">
        Esqueci minha senha
      </h2>
      <p className="text-sm text-muted-foreground text-center">Digite seu email para resetar a senha</p>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu email"
          className="w-80"

          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Resetar senha'}
        </Button>
        {message && (
          <p className={`mt-4 text-center text-sm ${success ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>

  )
}
