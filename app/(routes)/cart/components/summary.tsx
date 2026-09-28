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

/**
 * Only Subtotal/Total are shown — there is no shipping, tax, or discount
 * concept anywhere in `CreateOrderPayload`/`OrderResponse`, so a single
 * "Total" line is used rather than a redundant identical "Subtotal" line
 * with nothing between it and the total (see Task 7 report, Section 6/11).
 * This total is a client-side display computation from the current cart
 * snapshot only — Admin re-prices and validates authoritatively at order
 * time; the COD payload below still sends only `{ productId, quantity }`,
 * never a price.
 */
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
            <OrderSuccessCard
                order={codOrder}
                onContinue={() => setCodOrder(null)}
            />
        );
    }

    return (
        <div className="rounded-surface border border-border bg-surface-muted p-6">
            <h2 className="text-subheading text-foreground">Order Summary</h2>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-body font-medium text-foreground">Total</span>
                <div aria-live="polite">
                    <Currency value={totalPrice} />
                </div>
            </div>

            {/*
              This button opens the customer/shipping details form (a Modal
              containing CODDetailsForm) — it does not place the order
              itself. The order is only actually submitted when that form's
              own "Place Order" button is clicked. "Continue to Checkout"
              describes what clicking THIS button actually does; the
              underlying behavior (onClick opens the modal) is unchanged.
            */}
            <Button
                onClick={() => setIsCODModalOpen(true)}
                disabled={items.length === 0}
                className="mt-6 w-full justify-center bg-success text-success-foreground"
            >
                Continue to Checkout
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
