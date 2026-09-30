import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (storeId: string): Promise<Billboard> => {
    const res = await fetch(`${URL}/${storeId}`);

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`getBillboard failed (${res.status}): ${text.slice(0, 120)}`);
    }

    return res.json();
};

export default getBillboard;
