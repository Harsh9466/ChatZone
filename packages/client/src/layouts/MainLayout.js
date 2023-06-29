import React from "react";
// import NavbarTop from "../components/navbar/top/NavbarTop";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* <NavbarTop /> */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
