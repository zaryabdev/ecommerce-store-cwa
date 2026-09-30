import { Product } from "@/types";
import qs from "query-string";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  // Opt-in only: expands a top-level categoryId to include its immediate
  // children. Omitted/false keeps categoryId an exact match.
  includeChildCategories?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      colorId: query.colorId,
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      includeChildCategories: query.includeChildCategories || undefined,
    },
  });

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getProducts failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
};

export default getProducts;
