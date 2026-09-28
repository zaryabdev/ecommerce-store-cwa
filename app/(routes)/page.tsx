import Link from "next/link";

import getCategories from "@/actions/get-categories";
import getHomepageBillboard from "@/actions/get-homepage-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
    const [products, billboard, categories] = await Promise.all([
        getProducts({ isFeatured: true }),
        getHomepageBillboard(),
        getCategories(),
    ]);

    const topLevelCategories = categories.filter((category) => !category.parentId);

    return (
        <Container>
            {/* Hidden heading for correct document outline — the homepage
                otherwise has no visible page title (the header logo/name
                already establishes brand identity). */}
            <h1 className="sr-only">Home</h1>

            <div className="flex flex-col gap-y-12 pb-10">
                {/* Billboard renders its own internal padding/margins
                    (unchanged from before) so it stays flush with how the
                    category page's billboard already renders. */}
                {billboard && <Billboard data={billboard} priority aspectClassName="aspect-[4/5] sm:aspect-[16/9] md:aspect-[2.4/1]" />}

                <div className="flex flex-col gap-y-12 px-4 sm:px-6 lg:px-8">
                    {topLevelCategories.length > 0 && (
                        <section aria-labelledby="shop-by-category-heading" className="space-y-4">
                            <h2
                                id="shop-by-category-heading"
                                className="text-heading text-foreground"
                            >
                                Shop by Category
                            </h2>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {topLevelCategories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/category/${category.id}`}
                                        className="flex min-h-[88px] items-center justify-center rounded-surface border border-border bg-surface-muted px-4 py-6 text-center text-subheading text-foreground transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {products.length > 0 && (
                        <ProductList
                            title="Featured Products"
                            items={products}
                            headingClassName="text-heading text-foreground"
                            gridClassName="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
                        />
                    )}
                </div>
            </div>
        </Container>
    );
};

export default HomePage;
