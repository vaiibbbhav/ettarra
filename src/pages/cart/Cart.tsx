import { addDoc, collection } from "firebase/firestore";
import { useCart } from "../../context/CartContext";
import { Trash2 } from "lucide-react";
import { db } from "@/firebaseConfig/Firebase";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  console.log(cart);
  const orderRef = collection(db, "orders");
  const [placed, setPlaced] = useState(false);
  const {id}= useParams();
  

  const placeOrder = async () => {
  try {
    addDoc(orderRef, {tableNo:id,...cart});
  } catch (error) {
    console.error(error);
  }

  }
  

  if (getTotalPrice() === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500">Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-60">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-6">
        {cart.map(
          (item) =>
            item.count > 0 && (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-5 w-full sm:w-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#42281E]/10 rounded-lg"></div>
                    <img
                      src={item.imgSrc || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-[#42281E]/20"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#42281E]">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.tagline}</p>
                    <p className="text-sm mt-1">
                      <span className="text-gray-600">Rs.{item.price}</span> ×{" "}
                      {item.count} ={" "}
                      <span className="font-bold text-[#42281E]">
                        Rs.{item.price * item.count}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center bg-[#42281E] border-2 border-[#42281E] rounded-full text-white h-10 overflow-hidden shadow-sm">
                    <button
                      className="px-3 h-full hover:bg-[#42281E] hover:text-white transition-colors duration-200"
                      onClick={() => updateQuantity(item.id, item.count - 1)}
                      aria-label="Decrease quantity"
                    >
                      <span className="font-bold">−</span>
                    </button>
                    <span className="px-4 font-medium">{item.count}</span>
                    <button
                      className="px-3 h-full hover:bg-[#42281E] hover:text-white transition-colors duration-200"
                      onClick={() => updateQuantity(item.id, item.count + 1)}
                      aria-label="Increase quantity"
                    >
                      <span className="font-bold">+</span>
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center justify-center h-10 w-10 rounded-full text-red-500 hover:text-white hover:bg-red-500 border border-red-200 transition-colors duration-200"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
        )}
      </div>

      {getTotalPrice() > 0 && (
        <div className="mt-10 fixed  bottom-20 w-[90%] bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex  flex-col  justify-between items-start  gap-4">
            <div>
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-[#42281E]">
                Rs.{getTotalPrice()}
              </p>
            </div>
            <button
              onClick={() =>{
                placeOrder(), setPlaced(true);
              }}
              className="bg-[#42281E] text-center text-white px-8 py-3 rounded-full  shadow-md  mx-auto w-40"
            >
              {placed ? "Order Placed" : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
