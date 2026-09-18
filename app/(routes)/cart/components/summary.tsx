"use client";

import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import Modal from "@/components/ui/modal";
import useCart from "@/hooks/use-cart";
import { CreateOrderPayload, OrderResponse } from "@/types";
import CODDetailsForm from "./cod-details-form";
import OrderSuccessCard from "./order-success-card";

const Summary = () => {
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    const [loadingCOD, setLoadingCOD] = useState(false);
    const [codOrder, setCodOrder] = useState<OrderResponse | null>(null);
    const [isCODModalOpen, setIsCODModalOpen] = useState(false);

    const orderItems = useMemo(
        () => items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        [items],
    );

    const totalPrice = useMemo(
        () => items.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0),
        [items],
    );

    const submitCOD = useCallback(
        async (payload: CreateOrderPayload) => {
            if (orderItems.length === 0) return;

            try {
                setLoadingCOD(true);
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/cod`,
                    payload,
                );

                setCodOrder(res.data as OrderResponse);
                toast.success("Order placed.");
                removeAll();
                setIsCODModalOpen(false);
            } catch (error: any) {
                const msg =
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Failed to place order.";
                toast.error(msg);
            } finally {
                setLoadingCOD(false);
            }
        },
        [orderItems.length, removeAll],
    );

    if (codOrder) {
        return (
            <div className="px-4 py-6 mt-16 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <OrderSuccessCard
                    order={codOrder}
                    onContinue={() => setCodOrder(null)}
                />
            </div>
        );
    }

    return (
        <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-base font-medium text-gray-900">
                        Order total
                    </div>
                    <Currency value={totalPrice} />
                </div>
            </div>

            <Button
                onClick={() => setIsCODModalOpen(true)}
                disabled={items.length === 0}
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
            >
                Place Order
            </Button>

            <Modal
                open={isCODModalOpen}
                title="Order details"
                onClose={() => setIsCODModalOpen(false)}
            >
                <CODDetailsForm
                    items={orderItems}
                    submitting={loadingCOD}
                    onCancel={() => setIsCODModalOpen(false)}
                    onSubmit={submitCOD}
                />
            </Modal>
        </div>
    );
};

export default Summary;
