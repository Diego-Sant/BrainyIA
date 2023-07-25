import Heading from '@/components/heading'
import { SubscriptionButton } from '@/components/subscriptionButton'
import { Badge } from '@/components/ui/badge'
import { checkSubscription } from '@/lib/subscription'
import { Settings } from 'lucide-react'
import React from 'react'

const SettingsPage = async () => {
    const isPro = await checkSubscription();

  return (
    <div>
        <Heading title='Configurações' description='Gerenciar configurações da conta.' icon={Settings} iconColor='text-white' bgColor='bg-white/20' />
        <div className='px-4 lg:px-8 space-y-4'>
            <div className='text-gray-200 text-sm'>
            {isPro ? (
                <>
                    Seu plano atual é o <Badge variant="premium">PRO</Badge> 😊
                </>
                ) : (
                <>
                    Seu plano atual é gratuito!
                </>
            )}
            </div>
            <SubscriptionButton isPro={isPro} />
        </div>
    </div>
  )
}

export default SettingsPage