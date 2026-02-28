import { Urbanist } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";

import "./globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
    title: "Store",
    description: "Store - The place for all your purchases.",
};

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
            </body>
        </html>
    );
}
