import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface CartItemProps {
    data: Product;
    quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ data, quantity }) => {
    const cart = useCart();

    const onRemove = () => {
        cart.removeItem(data.id);
    };

    return (
        <li className="flex py-6 border-b">
            <div className="relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
                <Image
                    fill
                    src={data?.images[0]?.url || ""}
                    alt=""
                    className="object-cover object-center"
                />
            </div>
            <div className="relative flex flex-col justify-between flex-1 ml-4 sm:ml-6">
                <div className="absolute top-0 right-0 z-10">
                    <IconButton onClick={onRemove} icon={<X size={15} />} />
                </div>
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className="flex justify-between">
                        <p className="text-lg font-semibold text-black ">
                            {data.name}
                        </p>
                    </div>

                    <div className="flex mt-1 text-sm">
                        <p className="text-gray-500">{data.color.name}</p>
                        <p className="pl-4 ml-4 text-gray-500 border-l border-gray-200">
                            {data.size.name}
                        </p>
                    </div>
                    <div className="flex items-center mt-2 gap-x-3">
                        <div className="flex items-center gap-x-3 rounded-md border px-2 py-0.5">
                            <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() => cart.decrementItem(data.id)}
                                className="text-gray-500 hover:text-black"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-5 text-sm text-center">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() => cart.incrementItem(data.id)}
                                className="text-gray-500 hover:text-black"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <Currency value={Number(data.price) * quantity} />
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
