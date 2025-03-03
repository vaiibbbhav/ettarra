import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/landingPage/Home"
import Cart from "./pages/cart/Cart";
import { CartProvider } from "./context/CartContext";
import BaristaPanel from "./pages/barista/BaristaPanel";
import GoogleAuth from "./pages/Auth/GoogleAuth";
import Notification from "./pages/notification/Notification";



function App() {
  return (
    <>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/:id" element={<Home />} />
              <Route path="/cart/:id" element={<Cart />} />
            </Route>
            <Route path="/baristapanel" element={<BaristaPanel />}></Route>
            <Route path="/auth" element={<GoogleAuth />}></Route>
            <Route path="/notification/:id" element={<Notification />}></Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
