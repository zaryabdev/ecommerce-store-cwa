import Link from "next/link";

import Container from "@/components/ui/container";

/**
 * Global 404. Used both for unmatched URLs and for notFound() calls from
 * nested pages (product/[productId], category/[categoryId]) — Next resolves
 * to the nearest not-found.tsx up the segment tree, and there is no more
 * specific one, so this single file covers both cases. Renders inside the
 * root layout, so Navbar/Footer stay intact.
 */
const NotFound = () => {
    return (
        <div className="bg-background">
            <Container>
                <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center sm:px-6 lg:px-8">
                    <p className="text-meta font-semibold text-muted-foreground">404</p>
                    <h1 className="text-heading text-foreground">Page not found</h1>
                    <p className="max-w-md text-body text-muted-foreground">
                        We couldn&apos;t find what you were looking for. It may have been
                        moved or is no longer available.
                    </p>
                    <Link
                        href="/"
                        className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-body font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default NotFound;
