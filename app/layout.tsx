import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from "@clerk/localizations";
import { dark } from '@clerk/themes';

import { ModalProvider } from '@/components/modalProvider';
import { ToastProvider } from '@/components/toasterProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BrainyIA',
  description: 'IA com diversas funções feita com NextJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR} appearance={{baseTheme: dark}}>
      <html lang="pt-BR">
        <body className={inter.className}>
          <ModalProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
