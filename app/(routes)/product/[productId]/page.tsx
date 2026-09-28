import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import getProduct from '@/actions/get-product';
import getProducts from '@/actions/get-products';
import Container from '@/components/ui/container';

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  },
}

// Related Products is a quick browsing aid, not a second catalog page — cap
// it so it can't grow unbounded in a large category. 8 gives exactly two
// full rows at the 4-column desktop grid width used below.
const RELATED_PRODUCTS_LIMIT = 8;

const ProductPage: React.FC<ProductPageProps> = async ({
  params
 }) => {
  const product = await getProduct(params.productId);

  if (!product) {
    return null;
  }

  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id
  });

  // Exclude the current product from its own "related" list, and cap the
  // count — both are plain array operations on the data already returned,
  // not a new API/commerce capability.
  const relatedProducts = suggestedProducts
    .filter((item) => item.id !== product.id)
    .slice(0, RELATED_PRODUCTS_LIMIT);

  return (
    <div className="bg-background">
      <Container>
        <div className="flex flex-col gap-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
            <Gallery images={product.images} productName={product.name} priority />
            <div className="mt-8 lg:mt-0">
              <Info data={product} />
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <ProductList
              title="Related Products"
              items={relatedProducts}
              headingClassName="text-heading text-foreground"
              gridClassName="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
            />
          )}
        </div>
      </Container>
    </div>
  )
}

export default ProductPage;
