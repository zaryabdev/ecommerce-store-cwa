import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/homepage-billboard`;

const getHomepageBillboard = async (): Promise<Billboard | null> => {
    const res = await fetch(URL, { cache: "no-store" });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(
            `getHomepageBillboard failed (${res.status}): ${text.slice(0, 120)}`,
        );
    }

    return res.json();
};

export default getHomepageBillboard;
