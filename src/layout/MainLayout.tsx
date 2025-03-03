import React from "react";
import { Outlet } from "react-router-dom";
import ButtomBar from "@/components/ButtomBar";

const MainLayout = () => {
  return (
    <>
      <Outlet />
      <ButtomBar />
      
    </>
  );
};

export default MainLayout;
