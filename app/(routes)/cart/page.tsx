"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Container from '@/components/ui/container';
import Skeleton from '@/components/ui/skeleton';
import useCart from '@/hooks/use-cart';

import Summary from './components/summary'
import CartItem from './components/cart-item';

export const revalidate = 0;

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // The cart lives entirely in localStorage via Zustand's `persist` — it
  // genuinely cannot be known during SSR, so this gate stays (unlike the
  // Currency fix from Task 2, this is a real hydration boundary, not a
  // false one). Render a lightweight skeleton instead of a blank page
  // while waiting for it.
  if (!isMounted) {
    return (
      <div className="bg-background">
        <Container>
          <div className="px-4 py-16 sm:px-6 lg:px-8" role="status" aria-live="polite">
            <span className="sr-only">Loading…</span>
            <Skeleton className="h-9 w-48" />
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
              <div className="space-y-6 lg:col-span-7">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Total units across all lines — the same definition of "item" the
  // navbar's cart badge already uses (Task 3), so this count is consistent
  // with what the shopper saw before landing here, not a different metric.
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-background">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-heading text-foreground">Shopping Cart</h1>
          {cart.items.length > 0 && (
            <p className="mt-1 text-body text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          )}

          {cart.items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-surface border border-border bg-surface-muted px-6 py-20 text-center">
              <p className="text-subheading text-foreground">Your cart is empty</p>
              <p className="text-body text-muted-foreground">
                Looks like you haven&apos;t added anything yet.
              </p>
              <Link
                href="/"
                className="mt-2 text-body font-semibold text-foreground underline underline-offset-2 hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
              <ul className="lg:col-span-7">
                {cart.items.map((item) => (
                  <CartItem key={item.product.id} data={item.product} quantity={item.quantity} />
                ))}
              </ul>
              <div className="mt-10 lg:sticky lg:top-8 lg:col-span-5 lg:mt-0">
                <Summary />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
};

export default CartPage;
