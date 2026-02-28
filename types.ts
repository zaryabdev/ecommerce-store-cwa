export interface Product {
    id: string;
    category: Category;
    name: string;
    price: string;
    isFeatured: boolean;
    size: Size;
    color: Color;
    images: Image[];
}

export interface Image {
    id: string;
    url: string;
}

export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    billboard: Billboard;
}

export interface Size {
    id: string;
    name: string;
    value: string;
}

export interface Color {
    id: string;
    name: string;
    value: string;
}

export type OrderResponse = {
    orderId: string;
    trackingId: string;
    status: "DRAFT" | "CONFIRMED" | "DELIVERED" | "CANCELED" | string;
    paymentMethod: "COD" | "STRIPE" | string;
    totalPrice: number;
    store: { id: string; name: string };
    products: Array<{
        id: string;
        name: string;
        price: string | number;
        size?: { id: string; name: string; value: string };
        color?: { id: string; name: string; value: string };
    }>;
};

export type CreateOrderPayload = {
    productIds: string[];
    paymentMethod: "COD" | "STRIPE";
    customer?: {
        name?: string;
        phone?: string;
        email?: string;
    };
    shipping?: {
        line1: string;
        line2?: string;
        city: string;
        postalCode?: string;
        country?: string; // "PK"
        notes?: string;
    };
    notes?: string;
};
