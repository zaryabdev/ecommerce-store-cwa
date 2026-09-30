import { Size } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async (): Promise<Size[]> => {
  const res = await fetch(URL);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getSizes failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
};

export default getSizes;
