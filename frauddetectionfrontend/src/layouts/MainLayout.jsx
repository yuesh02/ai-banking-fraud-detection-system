import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import {
  useContext
} from "react";

import {
  useNavigate
} from "react-router-dom";

import AuthContext
  from "../context/AuthContext";

function MainLayout({ children }) {

  const { user, logout } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  /* Handle logout */

  const handleLogout =
    () => {

    logout();

    navigate("/login");

  };

  return (

    <div className="flex">

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div className="flex-1 bg-gray-100 min-h-screen">

        {/* TOP BAR */}

        <div className="flex justify-between items-center bg-white shadow px-6 py-3">

          {/* Navbar (left side) */}

          <Navbar />

          {/* User info + Logout */}

          <div className="flex items-center gap-4">

            {user && (

              <div className="text-sm text-gray-600">

                <span className="font-semibold">
                  {user.username}
                </span>

                {" ("}
                {user.role}
                {")"}

              </div>

            )}

            <button
              onClick={handleLogout}
              className="
                bg-red-500
                text-white
                px-3
                py-1
                rounded
                hover:bg-red-600
                transition
              "
            >
              Logout
            </button>

          </div>

        </div>

        {/* PAGE CONTENT */}

        <div className="p-6">

          {children}

        </div>

      </div>

    </div>

  );

}

export default MainLayout;