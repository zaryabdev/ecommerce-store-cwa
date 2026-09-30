"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself — specifically Navbar's
 * getCategories()/getStore() fetches (components/navbar.tsx), which run
 * above any other error boundary in the tree. global-error.tsx replaces the
 * entire root layout including <html>/<body>, so it must render its own
 * minimal shell rather than relying on Navbar/Footer, which may be exactly
 * what failed.
 */
const GlobalError = ({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        console.error("[GLOBAL_ERROR]");
    }, []);

    return (
        <html lang="en">
            <body>
                <div
                    role="alert"
                    style={{
                        display: "flex",
                        minHeight: "100vh",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        padding: "2rem",
                        textAlign: "center",
                        fontFamily: "system-ui, sans-serif",
                    }}
                >
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: "#6b7280", maxWidth: "28rem" }}>
                        We couldn&apos;t load the store. Please try again.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            minHeight: "44px",
                            padding: "0.625rem 1.25rem",
                            borderRadius: "9999px",
                            border: "none",
                            background: "#111827",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
};

export default GlobalError;
