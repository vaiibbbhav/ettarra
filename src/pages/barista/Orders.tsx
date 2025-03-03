"use client";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig/Firebase";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const orderRef = collection(db, "orders");
  const assignedbaristaRef = collection(db, "assignedbarista");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        const filteredData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(filteredData);
        console.log(filteredData);
      },
      (error) => {
        console.error("Error fetching orders:", error);
      }
    );

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#42281E] mb-6">Orders</h1>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {orders.map((order) => (
          <OrderCard key={order.id} orderData={order} />
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ orderData }) => {
  const [status, setStatus] = useState(orderData.status || "pending");

  const items = Object.keys(orderData)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => orderData[key]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const handleAccept = async () => {
    try {
      // Update the order status to "accepted"
      await updateDoc(doc(db, "orders", orderData.id), {
        status: "accepted",
      });

      // Add the order to the assignedbarista collection
      await addDoc(collection(db, "assignedbarista"), {
        name: auth?.currentUser?.displayName,
        tableNo: orderData.tableNo,
      });

      // Delete the order from the orders collection
      await deleteDoc(doc(db, "orders", orderData.id));

      // Update local state to reflect the deletion
      setStatus("accepted");
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleReject = async () => {
    try {
      // Delete the order from the orders collection
      await deleteDoc(doc(db, "orders", orderData.id));

      // Update local state to reflect the deletion
      setStatus("rejected");
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg w-full">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h3 className="text-lg font-bold text-[#42281E]">
            Table #{orderData.tableNo}
          </h3>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
              status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="flex gap-3">
                {item.imgSrc && (
                  <div className="hidden sm:block h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-[#42281E]">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({item.quantity})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.tagline}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm font-medium">
                  {item.count} × ₹{item.price}
                </div>
                <div className="text-sm font-bold text-[#42281E] mt-1">
                  ₹{item.price * item.count}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-3 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-[#42281E]">₹{totalPrice}</p>
          </div>

          {status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex items-center justify-center h-10 w-10 rounded-full text-red-500 hover:text-white hover:bg-red-500 border border-red-200 transition-colors duration-200"
                aria-label="Reject order"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleAccept}
                className="flex items-center justify-center h-10 w-10 rounded-full text-green-500 hover:text-white hover:bg-green-500 border border-green-200 transition-colors duration-200"
                aria-label="Accept order"
              >
                <Check size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
