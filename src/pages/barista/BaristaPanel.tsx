import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Call from "./Call";
import Orders from "./Orders";
import { auth } from "@/firebaseConfig/Firebase";
import { useNavigate } from "react-router-dom";

const BaristaPanel = () => {
  const navigate = useNavigate();
  console.log(auth.currentUser);

  if (!auth.currentUser) {
    navigate("/auth");
    
  }

  const name = auth.currentUser?.displayName;
  
  return (
    <section className="px-5 mt-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold ">Barista Panel</h1>
        <p>Hello, {name}</p>
      </div>
      <Tabs defaultValue="account" className="w-full  max-w-md mx-auto">
        <TabsList className="grid grid-cols-2 h-11 w-full">
          <TabsTrigger value="account" className="font-medium h-8">
            Assist Me
          </TabsTrigger>
          <TabsTrigger value="order" className="font-medium h-8">
            Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="">
          <Call />
        </TabsContent>
        <TabsContent value="order" className="">
          <Orders />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default BaristaPanel;
