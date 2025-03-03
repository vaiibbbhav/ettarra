import { auth, db } from "@/firebaseConfig/Firebase";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

const Call = () => {
  const [call, setCall] = useState([]);
  const callRef = collection(db, "call");
  const assignedbaristaRef = collection(db, "assignedbarista");

  const handleAccept = async (tableNo, callId) => {
    console.log(auth?.currentUser?.displayName);

    try {
      await addDoc(assignedbaristaRef, {
        name: auth?.currentUser?.displayName,
        tableNo: tableNo,
      });


      await deleteDoc(doc(callRef, callId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (callId) => {
    try {

      await deleteDoc(doc(callRef, callId));
    } catch (error) {
      console.error(error);
    }
  };

  const getCall = async () => {
    try {
      const data = await getDocs(callRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCall(filteredData);
    } catch (error) {
      console.error("Error fetching call data:", error);
    }
  };

  useEffect(() => {
    getCall();
    const queryMessage = collection(db, "call");
    const unsubscribe = onSnapshot(queryMessage, (querySnapshot) => {
      let message = [];
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCall(data);
    });
    return () => unsubscribe();
  }, []);

  const calculateElapsedTime = (startTime) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const elapsedTime = now - start;

    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const [elapsedTimes, setElapsedTimes] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedElapsedTimes = {};
      call.forEach((item) => {
        updatedElapsedTimes[item.id] = calculateElapsedTime(item.time);
      });
      setElapsedTimes(updatedElapsedTimes);
    }, 1000);

    return () => clearInterval(interval);
  }, [call]);

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#42281E] mb-6">Calls</h1>
      <div className="grid gap-4 pt-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {call.map((item) => (
          <Card
            key={item.id}
            className="p-4 shadow-lg border border-gray-200 rounded-2xl"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-600">
                Assistance Requested
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Table Number</p>
                  <p className="text-xl font-bold">{item.tableNo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <p className="text-lg font-medium">
                    {elapsedTimes[item.id] || "00:00:00"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  onClick={() => handleAccept(item?.tableNo, item.id)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleReject(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Call;
