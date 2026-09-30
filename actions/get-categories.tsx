import { Category } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(URL);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getCategories failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
};

export default getCategories;

