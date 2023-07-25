import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`WEBHOOK ERROR: ${error.message}`, {status: 400})
    }

    const sessions = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            sessions.subscription as string
        );

        if (!sessions?.metadata?.userId) {
            return new NextResponse("Id do usuário é requerido!", {status: 400})
        }

        await prismadb.userSubscription.create({
            data: {
                userId: sessions?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCostumerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        })
    }

    // Caso o usuário tinha uma assinatura antes e acabou expirando ou coisa do tipo
    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(
            sessions.subscription as string
        );

        await prismadb.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        });
    }

    return new NextResponse(null, { status: 200 })
}