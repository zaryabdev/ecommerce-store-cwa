"use client";

import React, { useMemo } from "react";

type WhatsAppFloatProps = {
    message?: string;
};

export default function WhatsAppFloat({
    message = "Hi! I need help.",
}: WhatsAppFloatProps) {
    const hasWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    const href = useMemo(() => {
        if (hasWhatsappNumber) {
            const text = encodeURIComponent(message);
            return `https://wa.me/${hasWhatsappNumber}?text=${text}`;
        }
    }, [hasWhatsappNumber, message]);

    if (!hasWhatsappNumber) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed z-50 inline-flex items-center justify-center text-white transition bg-green-500 rounded-full shadow-lg bottom-5 right-5 h-14 w-14 hover:scale-105 active:scale-95"
        >
            {/* simple WA icon (no deps) */}
            <svg
                viewBox="0 0 32 32"
                className="fill-current h-7 w-7"
                aria-hidden="true"
            >
                <path d="M19.11 17.62c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.6.14-.18.27-.69.87-.85 1.05-.16.18-.31.2-.58.07-.27-.14-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.41.12-.55.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.32.96 2.59 1.1 2.77.14.18 1.89 2.88 4.58 4.04.64.28 1.14.45 1.53.58.64.2 1.23.17 1.69.1.52-.08 1.58-.65 1.8-1.27.22-.62.22-1.15.16-1.27-.07-.12-.24-.2-.52-.34z" />
                <path d="M16.03 3C9.39 3 4 8.39 4 15.03c0 2.12.55 4.12 1.51 5.86L4 29l8.31-1.46c1.69.92 3.63 1.44 5.72 1.44 6.64 0 12.03-5.39 12.03-12.03C30.06 8.39 22.67 3 16.03 3zm0 22.03c-1.87 0-3.6-.55-5.05-1.5l-.36-.23-4.93.87.9-4.8-.24-.38a9.95 9.95 0 0 1-1.58-5.36c0-5.54 4.51-10.05 10.05-10.05s10.05 4.51 10.05 10.05-4.51 10.05-10.05 10.05z" />
            </svg>
        </a>
    );
}
