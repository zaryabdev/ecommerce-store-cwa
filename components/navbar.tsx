import Image from "next/image";
import Link from "next/link";

import getCategories from "@/actions/get-categories";
import getStore from "@/actions/get-store";
import MainNav from "@/components/main-nav";
import MobileNav from "@/components/mobile-nav";
import NavbarActions from "@/components/navbar-actions";
import Container from "@/components/ui/container";

const Navbar = async () => {
    const categories = await getCategories();
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    const store = storeId ? await getStore(storeId) : null;

    return (
        <div className="border-b border-border bg-surface">
            <Container>
                <div className="relative flex items-center h-16 gap-x-3 px-4 sm:px-6 lg:px-8">
                    <div className="lg:hidden">
                        <MobileNav categories={categories} />
                    </div>

                    <Link
                        href="/"
                        className="flex items-center gap-x-2"
                    >
                        {store?.logoUrl ? (
                            <div className="relative w-[120px] h-[36px]">
                                <Image
                                    src={store.logoUrl}
                                    alt={store?.name ?? "Store logo"}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        ) : (
                            <p className="text-xl font-bold text-foreground">
                                {store?.name ?? "STORE"}
                            </p>
                        )}
                    </Link>

                    <div className="hidden lg:block">
                        <MainNav data={categories} />
                    </div>

                    <div className="ml-auto flex items-center">
                        <NavbarActions />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Navbar;
