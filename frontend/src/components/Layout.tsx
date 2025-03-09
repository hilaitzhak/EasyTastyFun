import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex-1 pt-[64px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;