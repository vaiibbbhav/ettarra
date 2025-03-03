import React from "react";
import { useCart } from "../context/CartContext";

interface ItemProps {
  item: {
    id: number;
    name: string;
    tagline: string;
    quantity: string;
    price: number;
    imgSrc: string;
  };
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const { addToCart, updateQuantity, cart } = useCart();
  const cartItem = cart.find((i) => i.id === item.id);
  const count = cartItem?.count || 0;

  return (
    <div className="bg-white w-64 shadow-sm pb-4 rounded-3xl">
      <div className="w-64 h-36">
        <img
          src={item.imgSrc}
          alt={item.name}
          className="w-full h-full object-cover rounded-t-3xl"
        />
      </div>
      <div className="px-2 rounded-b-2xl">
        <p className="mt-2 text-lg font-medium">{item.name}</p>
        <p className="text-sm">{item.tagline}</p>
        <p className="mt-2">
          {item.quantity}:{" "}
          <span className="font-semibold">Rs.{item.price}</span>
        </p>
      </div>

      <div className="flex justify-between mt-4 px-3">
        

        {count === 0 ? (
          <button
            className="py-2 px-4 bg-[#42281E] text-white rounded-xl h-10"
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center bg-[#42281E] rounded-2xl text-white h-10">
            <button
              className="px-3 h-full flex items-center justify-center"
              onClick={() => updateQuantity(item.id, count - 1)}
            >
              <span className="text-xl font-bold">-</span>
            </button>
            <span className="px-2">{count}</span>
            <button
              className="px-3 h-full flex items-center justify-center"
              onClick={() => updateQuantity(item.id, count + 1)}
            >
              <span className="text-xl font-bold">+</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
