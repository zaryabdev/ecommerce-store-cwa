
import Container from '@/components/ui/container';
import Billboard from '@/components/ui/billboard';
import ProductCard from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';
import { cn } from '@/lib/utils';

import getProducts from "@/actions/get-products";
import getCategory from '@/actions/get-category';
import getCategories from '@/actions/get-categories';
import getSizes from '@/actions/get-sizes';
import getColors from '@/actions/get-colors';

import CategoryNav from './components/category-nav';
import Filter from './components/filter';
import MobileFilters from './components/mobile-filters';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  },
  searchParams: {
    colorId: string;
    sizeId: string;
  }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ 
  params, 
  searchParams
}) => {
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
    includeChildCategories: true,
  });
  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(params.categoryId);
  const categories = await getCategories();

  // Two-level hierarchy: a top-level category shows its own children,
  // a child category shows its parent's family (itself and its siblings).
  const parent = category.parentId
    ? categories.find((item) => item.id === category.parentId)
    : category;
  const children = parent
    ? categories.filter((item) => item.parentId === parent.id)
    : [];
  const family = parent && children.length > 0 ? { parent, children } : null;

  return (
    <div className="bg-white">
      <Container>
        {category.billboard && (
          <Billboard 
            data={category.billboard}
          />
        )}
        <div className={cn("px-4 sm:px-6 lg:px-8 pb-24", !category.billboard && "pt-8")}>
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters
              sizes={sizes}
              colors={colors}
              family={family}
              activeCategoryId={category.id}
            />
            <div className="hidden lg:block">
              {family && (
                <CategoryNav
                  parent={family.parent}
                  items={family.children}
                  activeId={category.id}
                />
              )}
              <Filter
                valueKey="sizeId" 
                name="Sizes" 
                data={sizes}
              />
              <Filter 
                valueKey="colorId" 
                name="Colors" 
                data={colors}
              />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
