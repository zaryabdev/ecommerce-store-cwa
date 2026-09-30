import { Product } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/products`;

// Admin returns HTTP 200 with a `null` body for an unknown product id
// (Prisma `findUnique` result passed straight to `NextResponse.json`) rather
// than a 404 status — so `null` here means "genuinely not found", not a
// fetch failure, and callers should call notFound() for it.
const getProduct = async (id: string): Promise<Product | null> => {
  const res = await fetch(`${URL}/${id}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getProduct failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
};

export default getProduct;
