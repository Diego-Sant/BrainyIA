import { Button } from "@/components/ui/button";
import Link from "next/link";

const Landing = () => {
    return (
      <div>
        Landing
        <div>
          <Link href="/entrar">
            <Button>
              Entrar
            </Button>
          </Link>
          <Link href="/cadastrar">
            <Button>
              Cadastrar
            </Button>
          </Link>
        </div>
      </div>
    )
}

export default Landing;