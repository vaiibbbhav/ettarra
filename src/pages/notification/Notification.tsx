import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/firebaseConfig/Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Notification = () => {
  const assignedbaristaRef = collection(db, "assignedbarista");
  const { id } = useParams();
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const q = query(
      assignedbaristaRef
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const filteredData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotification(filteredData);
        console.log(filteredData);
      },
      (error) => {
        console.error("Error fetching notification data:", error);
      }
    );

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, [id]);

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {notification.map(
        (item) =>
          item.tableNo === id && (
            <Card
              key={item.id}
              className="w-full max-w-lg p-4 bg-white border-l-4 border-black shadow-md rounded-lg mb-4"
            >
              <CardContent className="flex items-center space-x-4 p-4">
                <Bell className="text-black" size={24} />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Notification
                  </h2>
                  <p className="text-gray-600">
                    {item.name} has been assigned to your table number{" "}
                    {item.tableNo}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )
      )}
      {notification.length === 0 && (
        <p className="text-gray-600">No notifications for this table.</p>
      )}
    </div>
  );
};

export default Notification;
