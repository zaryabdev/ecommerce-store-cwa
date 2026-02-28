"use client";

import Button from "@/components/ui/button";
import type { CreateOrderPayload } from "@/types"; // or wherever you keep it
import { useMemo, useState } from "react";

type FormValues = {
    name: string;
    phone: string;
    email: string;
    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    notes: string;
};

export default function CODDetailsForm({
    productIds,
    onSubmit,
    submitting,
    onCancel,
}: {
    productIds: string[];
    submitting: boolean;
    onCancel: () => void;
    onSubmit: (payload: CreateOrderPayload) => Promise<void>;
}) {
    const [vals, setVals] = useState<FormValues>({
        name: "",
        phone: "",
        email: "",
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
        notes: "",
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        // minimal COD requirements (you can tighten later)
        if (!vals.name.trim()) e.name = "Name is required";
        if (!vals.phone.trim()) e.phone = "Phone is required";
        if (!vals.line1.trim()) e.line1 = "Address line 1 is required";
        if (!vals.city.trim()) e.city = "City is required";
        return e;
    }, [vals]);

    const isValid = Object.keys(errors).length === 0;

    const set =
        (key: keyof FormValues) =>
        (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setVals((p) => ({ ...p, [key]: ev.target.value }));
        };

    const markTouched = (key: keyof FormValues) => () =>
        setTouched((p) => ({ ...p, [key]: true }));

    const showError = (key: keyof FormValues) => touched[key] && errors[key];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // mark all as touched if invalid
        if (!isValid) {
            setTouched({
                name: true,
                phone: true,
                email: true,
                line1: true,
                line2: true,
                city: true,
                postalCode: true,
                notes: true,
            });
            return;
        }

        const payload: CreateOrderPayload = {
            productIds,
            paymentMethod: "COD",
            customer: {
                name: vals.name.trim(),
                phone: vals.phone.trim(),
                email: vals.email.trim() || undefined,
            },
            shipping: {
                line1: vals.line1.trim(),
                line2: vals.line2.trim() || undefined,
                city: vals.city.trim(),
                postalCode: vals.postalCode.trim() || undefined,
                country: "PK",
                notes: vals.notes.trim() || undefined,
            },
            notes: vals.notes.trim() || undefined,
        };

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer */}
            <div>
                <div className="text-sm font-semibold text-gray-900">
                    Customer details
                </div>
                <div className="grid grid-cols-1 gap-3 mt-3">
                    <div>
                        <label className="text-xs text-gray-600">Name *</label>
                        <input
                            className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                            value={vals.name}
                            onChange={set("name")}
                            onBlur={markTouched("name")}
                            placeholder="Your name"
                        />
                        {showError("name") ? (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label className="text-xs text-gray-600">Phone *</label>
                        <input
                            className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                            value={vals.phone}
                            onChange={set("phone")}
                            onBlur={markTouched("phone")}
                            placeholder="+92..."
                        />
                        {showError("phone") ? (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.phone}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label className="text-xs text-gray-600">
                            Email (optional)
                        </label>
                        <input
                            className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                            value={vals.email}
                            onChange={set("email")}
                            placeholder="name@email.com"
                        />
                    </div>
                </div>
            </div>

            {/* Shipping */}
            <div>
                <div className="text-sm font-semibold text-gray-900">
                    Delivery address
                </div>
                <div className="grid grid-cols-1 gap-3 mt-3">
                    <div>
                        <label className="text-xs text-gray-600">
                            Address line 1 *
                        </label>
                        <input
                            className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                            value={vals.line1}
                            onChange={set("line1")}
                            onBlur={markTouched("line1")}
                            placeholder="House, street, area"
                        />
                        {showError("line1") ? (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.line1}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label className="text-xs text-gray-600">
                            Address line 2 (optional)
                        </label>
                        <input
                            className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                            value={vals.line2}
                            onChange={set("line2")}
                            placeholder="Apartment, landmark"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-xs text-gray-600">
                                City *
                            </label>
                            <input
                                className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                                value={vals.city}
                                onChange={set("city")}
                                onBlur={markTouched("city")}
                                placeholder="Karachi"
                            />
                            {showError("city") ? (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.city}
                                </p>
                            ) : null}
                        </div>

                        <div>
                            <label className="text-xs text-gray-600">
                                Postal code (optional)
                            </label>
                            <input
                                className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                                value={vals.postalCode}
                                onChange={set("postalCode")}
                                placeholder="74200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-600">
                            Delivery notes (optional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 mt-1 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-black/10"
                            value={vals.notes}
                            onChange={set("notes")}
                            rows={3}
                            placeholder="Leave at reception, call on arrival..."
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="w-full text-gray-900 bg-gray-100 sm:w-auto hover:bg-gray-200"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={!isValid || submitting}
                    className="w-full bg-green-600 sm:w-auto hover:bg-green-700"
                >
                    {submitting ? "Placing Order..." : "Place COD Order"}
                </Button>
            </div>
        </form>
    );
}
