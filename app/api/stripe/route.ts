import { currentUser, auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/configuracoes");

export async function GET() {
    try {
        const {userId} = auth();
        const user = await currentUser();
        // Ambos pegos do clerk

        if (!userId || !user) {
            return new NextResponse("Não autorizado!", {status: 401});
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        });

        if (userSubscription && userSubscription.stripeCostumerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCostumerId,
                return_url: settingsUrl
            });

            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress, // Pego do clerk
            line_items: [
                {
                    price_data: {
                        currency: "BRL",
                        product_data: {
                            name: "BrainyIA Pro",
                            description: "Usos ilimitados do BrainyIA."
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId
            }
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    } catch (error) {
        console.log("[STRIPE_ERROR]", error);
        return new NextResponse("Erro interno", {status: 500})
    }
}