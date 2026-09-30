import { Metadata } from "next";
import { Urbanist } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import getStore from "@/actions/get-store";

import WhatsAppFloat from "@/components/ui/whatspp-float";
import "./globals.css";

const font = Urbanist({ subsets: ["latin"] });

// Same store-id env var and getStore() call Navbar already makes — Next
// dedupes identical fetches within one render, so this isn't a second
// network request. Falls back to a generic title/description rather than
// throwing: Navbar's own unguarded getStore() call already throws to
// app/global-error.tsx on a real failure, so metadata doesn't need to be a
// second, redundant failure point — it only needs to degrade gracefully.
export async function generateMetadata(): Promise<Metadata> {
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    const store = storeId ? await getStore(storeId).catch(() => null) : null;
    const name = store?.name ?? "Store";

    return {
        title: name,
        description: `${name} - The place for all your purchases.`,
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${font.className} min-h-screen flex flex-col`}>
                <ToastProvider />
                <ModalProvider />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <WhatsAppFloat message="Hi! I want to place an order." />
            </body>
        </html>
    );
}
