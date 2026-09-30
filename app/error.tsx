"use client";

import { useEffect } from "react";
import Link from "next/link";

import Container from "@/components/ui/container";
import Button from "@/components/ui/button";

/**
 * Catches thrown errors from page-level Server Component data fetching
 * (Homepage, Category, Product Detail) — Navbar/Footer stay rendered since
 * this boundary only replaces the routed page content, not the root layout.
 * Does not catch errors thrown by Navbar itself (it renders in the layout,
 * above this boundary) — see app/global-error.tsx for that case.
 */
const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="bg-background">
            <Container>
                <div
                    role="alert"
                    className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8"
                >
                    <h1 className="text-heading text-foreground">
                        Something went wrong
                    </h1>
                    <p className="max-w-md text-body text-muted-foreground">
                        We couldn&apos;t load this page. Please try again.
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                        <Button onClick={() => reset()}>Try again</Button>
                        <Link
                            href="/"
                            className="text-body font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Error;
