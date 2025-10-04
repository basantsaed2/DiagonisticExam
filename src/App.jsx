import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "./index.css";
import Navbar from "./Components/Navbar";
// import Footer from "./Components/Footer";

const App = () => {

  return (
    <PrimeReactProvider>
      <div
        className="relative flex flex-col items-center w-full h-screen overflow-x-hidden overflow-y-scroll bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="sticky top-0 z-40 w-full">
          <Navbar />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </PrimeReactProvider>
  );
};

export default App;
