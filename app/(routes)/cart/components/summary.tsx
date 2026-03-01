"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import Modal from "@/components/ui/modal";
import useCart from "@/hooks/use-cart";
import { CreateOrderPayload, OrderResponse } from "@/types";
import CODDetailsForm from "./cod-details-form";
import OrderSuccessCard from "./order-success-card";

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    const [loadingCOD, setLoadingCOD] = useState(false);
    const [codOrder, setCodOrder] = useState<OrderResponse | null>(null);
    const [isCODModalOpen, setIsCODModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Payment completed.");
            removeAll();
        }
        if (searchParams.get("canceled")) {
            toast.error("Something went wrong.");
        }
    }, [searchParams, removeAll]);

    const productIds = useMemo(() => items.map((i) => i.id), [items]);

    const totalPrice = useMemo(
        () => items.reduce((total, item) => total + Number(item.price), 0),
        [items],
    );

    const onCheckout = async () => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
            {
                productIds,
            },
        );

        window.location.href = response.data.url;
    };

    const submitCOD = useCallback(
        async (payload: CreateOrderPayload) => {
            if (productIds.length === 0) return;

            try {
                setLoadingCOD(true);
                debugger;
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/cod`,
                    payload,
                );

                setCodOrder(res.data as OrderResponse);
                toast.success("Order placed! Pay on delivery.");
                removeAll();
                setIsCODModalOpen(false);
            } catch (error: any) {
                const msg =
                    typeof error?.response?.data === "string"
                        ? error.response.data
                        : "Failed to place COD order.";
                toast.error(msg);
            } finally {
                setLoadingCOD(false);
            }
        },
        [productIds.length, removeAll],
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
                onClick={onCheckout}
                disabled={items.length === 0}
                className="w-full mt-6"
            >
                Proceed to Payment
            </Button>

            <Button
                onClick={() => setIsCODModalOpen(true)}
                disabled={items.length === 0}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
                Cash on Delivery
            </Button>

            <Modal
                open={isCODModalOpen}
                title="Cash on Delivery details"
                onClose={() => setIsCODModalOpen(false)}
            >
                <CODDetailsForm
                    productIds={productIds}
                    submitting={loadingCOD}
                    onCancel={() => setIsCODModalOpen(false)}
                    onSubmit={submitCOD}
                />
            </Modal>
        </div>
    );
};

export default Summary;
