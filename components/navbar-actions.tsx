"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  // Unchanged business logic: total quantity across cart lines.
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative flex items-center">
      <IconButton
        onClick={() => router.push('/cart')}
        aria-label={itemCount > 0 ? `Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Cart'}
        icon={<ShoppingBag size={20} />}
      />
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground"
        >
          {itemCount}
        </span>
      )}
    </div>
  );
}

export default NavbarActions;
