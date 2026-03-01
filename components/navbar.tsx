import Image from "next/image";
import Link from "next/link";

import getCategories from "@/actions/get-categories";
import getStore from "@/actions/get-store";
import MainNav from "@/components/main-nav";
import NavbarActions from "@/components/navbar-actions";
import Container from "@/components/ui/container";

const Navbar = async () => {
    const categories = await getCategories();
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    const store = storeId ? await getStore(storeId) : null;

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center ml-4 lg:ml-0 gap-x-2"
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
                            <p className="text-xl font-bold">
                                {store?.name ?? "STORE"}
                            </p>
                        )}
                    </Link>

                    <MainNav data={categories} />
                    <NavbarActions />
                </div>
            </Container>
        </div>
    );
};

export default Navbar;
