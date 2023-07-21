import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'

import { ptBR } from "@clerk/localizations";
import { dark } from '@clerk/themes';

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
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
