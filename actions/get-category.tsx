import { Category } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/categories`;

// Admin returns HTTP 200 with a `null` body for an unknown category id
// (Prisma `findUnique` result passed straight to `NextResponse.json`) rather
// than a 404 status — so `null` here means "genuinely not found", not a
// fetch failure, and callers should treat it as such (see product/[productId]
// page for the same contract on products).
const getCategory = async (id: string): Promise<Category | null> => {
  const res = await fetch(`${URL}/${id}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getCategory failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
};

export default getCategory;
