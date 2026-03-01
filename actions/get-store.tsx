import { Store } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // http://localhost:3000/api

const getStore = async (storeId: string): Promise<Store> => {
    const url = `${API_URL}/stores/${storeId}`;
    console.log("getStore--------------------------");
    console.log(url);
    console.log("getStore--------------------------");

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `getStore failed (${res.status}): ${text.slice(0, 120)}`,
        );
    }

    return res.json();
};

export default getStore;
