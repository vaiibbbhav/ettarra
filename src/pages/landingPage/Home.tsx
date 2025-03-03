import { Bell, Search, Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Item from "../../components/Item"
import { db } from "@/firebaseConfig/Firebase";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";




// const mockData = [
//   {
//     id: 1,
//     name: "South Indian Filter Kaapi",
//     tagline: "Bass Naam Hi Kaapi Hai",
//     quantity: "250ml",
//     price: 190,
//     imgSrc:
//       "https://firebasestorage.googleapis.com/v0/b/ettarracoffee-house.appspot.com/o/coffee%20Large.jpeg?alt=media&token=c660952e-05ea-4e51-8c41-fae823ee5adc",
//   },
//   {
//     id: 2,
//     name: "Espresso",
//     tagline: "Strong & Bold",
//     quantity: "60ml",
//     price: 120,
//     imgSrc:
//       "https://firebasestorage.googleapis.com/v0/b/ettarracoffee-house.appspot.com/o/coffee%20Large.jpeg?alt=media&token=c660952e-05ea-4e51-8c41-fae823ee5adc",
//   },
//   {
//     id: 3,
//     name: "Cappuccino",
//     tagline: "A Classic Delight",
//     quantity: "200ml",
//     price: 180,
//     imgSrc:
//       "https://firebasestorage.googleapis.com/v0/b/ettarracoffee-house.appspot.com/o/coffee%20Large.jpeg?alt=media&token=c660952e-05ea-4e51-8c41-fae823ee5adc",
//   },
//   {
//     id: 4,
//     name: "Latte",
//     tagline: "Smooth & Creamy",
//     quantity: "250ml",
//     price: 200,
//     imgSrc:
//       "https://firebasestorage.googleapis.com/v0/b/ettarracoffee-house.appspot.com/o/coffee%20Large.jpeg?alt=media&token=c660952e-05ea-4e51-8c41-fae823ee5adc",
//   },
//   {
//     id: 5,
//     name: "Mocha",
//     tagline: "Coffee Meets Chocolate",
//     quantity: "250ml",
//     price: 210,
//     imgSrc:
//       "https://firebasestorage.googleapis.com/v0/b/ettarracoffee-house.appspot.com/o/coffee%20Large.jpeg?alt=media&token=c660952e-05ea-4e51-8c41-fae823ee5adc",
//   },
// ];

interface Item {
  id: string;
  name: string;
  tagline: string;
  quantity: string;
  price: number;
  imgSrc: string;
}


const Home = () => {


  const {id} = useParams();
  console.log(id);
  

  
  
  const [items, setItems] = useState<Item[]>([]);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(true);
  
  

  const itemsRef = collection(db, "items");
  const callRef = collection(db, "call");

  const getItems = async () => {
    try {
      const data = await getDocs(itemsRef);
      const filteredData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
      console.log(filteredData);
      setItems(filteredData);
      setLoading(false);
      
    } catch (error) {
      console.log(error);
      
    }
  };


  useEffect(() => {
  getItems()
    
  }, []);


  const handleCall = async () => {
    const isoDate = new Date().toISOString();
    try {
      addDoc(callRef, {
        tableNo: id,
        createdAt: serverTimestamp(),
        status: "pending",
        time: isoDate,
      });
    } catch (error) {
      console.log(error);
    }
    setCalled(true);
    console.log({
      tableNo: id,
      createdAt: serverTimestamp(),
      time:isoDate,
      status: "pending",
    });
  };

  return (
    <>
      <section
        style={{ height: "100svh" }}
        className="pl-4 flex flex-col  max-w-[30rem] h-screen bg-[#fbfbfb] pt-5"
      >
        <div className="heading mb-9 px-4 ">
          <div className="flex justify-between items-center">
            <div className="mb-9 gap-1 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900">Ettarra Coffee House</h1>
              
            </div>

            <div className="bell mb-5">
              <Link to={`/notification/${id}`}>
                <Bell className="size-8" />
              </Link>
            </div>
          </div>
          <div className="searchfilter flex w-full justify-between items-center">
            <div className="search flex items-center w-full  border border-gray-200 rounded-3xl max-w-80 py-1 px-3">
              <Search />
              <input
                type="text"
                placeholder="Search"
                className="py-2 w-full rounded-3xl pl-4 outline-none"
              />
            </div>
            <div className="filter ml-3 p-3 bg-[#42281E] rounded-3xl">
              <Settings2 className="text-white" />
            </div>
          </div>
        </div>

        <div className="call mb-11 flex items-center justify-between px-3 pr-4">
          <p className="text-2xl max-w-52">Barista at Your Service!</p>
          <button
            onClick={handleCall}
            className="text-white px-6 rounded-xl py-3 bg-[#42281E] "
          >
            {" "}
            {called ? "Called" : "Call"}{" "}
          </button>
        </div>

        <div className="dynamic pr-4">
          <div className="heading flex items-center justify-between mb-5 ">
            <p className="text-2xl font-medium"> Popular</p>
            <p className=" font-medium "> See All</p>
          </div>

          <div
            className="items  flex gap-4 pb-2 overflow-x-scroll touch-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {items.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
