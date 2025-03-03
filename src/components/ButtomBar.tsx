import { ShoppingCart, SquareMenu } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ButtomBar = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const {id} = useParams();
  return (
    <div className="fixed w-full h-16 grid grid-cols-2 overflow-hidden bottom-0">
      <div className="menu h-16 bg-[#41271D] flex flex-col items-center justify-center">
        <Link to={`/${id}`}>
          <div className="flex flex-col items-center justify-center">
            <SquareMenu className="text-white" />
            <span className="text-white">Menu</span>
          </div>
        </Link>
      </div>
      <div className="menu h-16 bg-[#41271D] flex flex-col items-center justify-center relative">
        <Link to={`/cart/${id}`}>
          <div className="flex items-center justify-center">
            <div>
              <ShoppingCart className="text-white" />
              <span className="text-white">Cart</span>
            </div>
            <div>
              {cartCount > 0 && (
                <span className="relative -top-4 right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ButtomBar;
