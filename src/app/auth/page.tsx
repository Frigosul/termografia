import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignIn() {

  return (
    <>
      <div>Logo - Termografia</div>
      <div className="flex justify-center items-center">
        <div>
          <form>
            <Input />
            <Input type="password" />

            <Button type="submit">Entrar</Button>
          </form>
        </div>
      </div>
    </>
  )
}