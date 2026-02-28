"use client";

import { formatMoney } from "@/lib/money";
import { OrderResponse } from "@/types";
import { useMemo, useState } from "react";

function normalizeColorHex(hex?: string) {
    if (!hex) return null;
    const v = hex.trim();
    if (!v) return null;
    return v.startsWith("#") ? v : `#${v}`;
}

export default function OrderSuccessCard({
    order,
    onContinue,
}: {
    order: OrderResponse;
    onContinue?: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const total = useMemo(() => {
        // trust API first; fallback to computed
        if (typeof order.totalPrice === "number") return order.totalPrice;

        return order.products.reduce((sum, p) => sum + Number(p.price ?? 0), 0);
    }, [order.totalPrice, order.products]);

    const onCopyTracking = async () => {
        try {
            await navigator.clipboard.writeText(order.trackingId);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch {
            // silent; you can toast if you want
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white border shadow-sm rounded-2xl">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm font-medium text-emerald-700">
                            Order placed
                        </div>
                        <h2 className="mt-1 text-xl font-semibold text-gray-900">
                            Thanks! We’ve received your order.
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Store:{" "}
                            <span className="font-medium text-gray-900">
                                {order.store?.name}
                            </span>
                        </p>
                    </div>

                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                        {order.paymentMethod}
                    </span>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-1">
                    <div className="p-3 rounded-xl bg-gray-50">
                        <div className="text-xs text-gray-500">Tracking</div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="font-mono text-sm text-gray-900">
                                {order.trackingId}
                            </div>
                            <button
                                onClick={onCopyTracking}
                                className="px-2 py-1 text-xs bg-white border rounded-lg hover:bg-gray-50"
                                type="button"
                            >
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50">
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="mt-1 text-sm font-medium text-gray-900">
                            {order.status}
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                            {formatMoney(total, { noDecimals: true })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900">Items</h3>

                <ul className="mt-3 divide-y">
                    {order.products.map((p) => {
                        const hex = normalizeColorHex(p.color?.value);
                        return (
                            <li
                                key={p.id}
                                className="flex items-start justify-between gap-4 py-4"
                            >
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {p.name}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600">
                                        {p.size?.name ? (
                                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                                                Size:{" "}
                                                <span className="font-medium text-gray-800">
                                                    {p.size.name}
                                                </span>
                                            </span>
                                        ) : null}

                                        {p.color?.name ? (
                                            <span className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full">
                                                <span
                                                    className="w-3 h-3 border rounded-full"
                                                    style={
                                                        hex
                                                            ? {
                                                                  backgroundColor:
                                                                      hex,
                                                              }
                                                            : undefined
                                                    }
                                                    aria-hidden
                                                />
                                                Color:{" "}
                                                <span className="font-medium text-gray-800">
                                                    {p.color.name}
                                                </span>
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="text-sm font-semibold text-gray-900 shrink-0">
                                    {formatMoney(Number(p.price ?? 0), {
                                        noDecimals: true,
                                    })}
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800"
                    >
                        Continue shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
