"use client";

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link';
import TypewriterComponent from 'typewriter-effect';
import { Button } from './ui/button';

const LandingHero = () => {
    const { isSignedIn } = useAuth();

  return (
    <div className='text-white font-bold py-36 text-center space-y-5'>
        <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'>
            <h1>A melhor IA para</h1>
            <div className='text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] via-[#FF1493] to-[#800080] pb-2'>
                <TypewriterComponent options={{
                    strings: [
                        "Bate-papo",
                        "Matemática",
                        "Traduzir",
                        "Ciência",
                        "História",
                        "Códigos",
                        "Gerar imagens",
                        "Gerar vídeos",
                        "Gerar músicas"
                    ],
                    autoStart: true,
                    loop: true
                }} />
            </div>
        </div>
        <div className='lg:text-xl text-sm font-light text-gray-200 px-2 sm:px-0'>
            Tire dúvidas, resolva problemas, teste sua criatividade e se divirta com a nossa inteligência artifical!
        </div>
        <div>
            <Link href={isSignedIn ? "/dashboard" : "/entrar"}>
                <Button variant="premium" className='md:text-lg p-4 md:p-6'>
                    Comece sua jornada de graça!
                </Button>
            </Link>
        </div>
        <div className='text-gray-200 text-xs font-normal'>
            Não é necessário cartão de crédito.
        </div>
    </div>
  )
}

export default LandingHero