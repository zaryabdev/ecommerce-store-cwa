"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import Currency  from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";

interface InfoProps {
  data: Product
};

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);

  const inStock = data.quantity > 0;

  const onAddToCart = () => {
    cart.addItem(data, quantity);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div>
            {data?.size?.value}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: data?.color?.value }} />
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Availability:</h3>
          {inStock ? (
            <span className="text-sm font-medium text-green-700">In stock</span>
          ) : (
            <span className="text-sm font-medium text-red-600">Out of stock</span>
          )}
        </div>
      </div>
      {inStock && (
        <div className="mt-6 flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Quantity:</h3>
          <div className="flex items-center gap-x-3 rounded-md border px-3 py-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-gray-500 hover:text-black"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(data.quantity, q + 1))}
              className="text-gray-500 hover:text-black"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} disabled={!inStock} className="flex items-center gap-x-2">
          {inStock ? "Add To Cart" : "Out of stock"}
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
}

export default Info;
