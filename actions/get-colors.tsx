import { Color } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/colors`;

const getColors = async (): Promise<Color[]> => {
  const res = await fetch(URL);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getColors failed (${res.status}): ${text.slice(0, 120)}`);
  }

  return res.json();
};

export default getColors;
