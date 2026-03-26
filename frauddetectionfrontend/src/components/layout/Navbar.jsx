import { ChevronDown, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="
      h-16
      bg-white
      border-b border-gray-200
      flex items-center justify-between
      px-6
      sticky top-0 z-40
    ">

      {/* LEFT */}
      <div className="flex items-center gap-6">

        <h1 className="text-lg font-semibold text-gray-900">
          Fraud<span className="text-indigo-600">Shield</span>
        </h1>

        <span className="text-sm text-gray-400 hidden md:block">
          Dashboard
        </span>

      </div>

      {/* RIGHT */}
      <div className="relative">

        <div
          onClick={() => setOpen(!open)}
          className="
            flex items-center gap-2
            px-2 py-1.5 rounded-lg
            hover:bg-gray-100
            transition cursor-pointer
          "
        >

          {/* Avatar */}
          <div className="
            w-8 h-8 rounded-full
            bg-indigo-500 text-white
            flex items-center justify-center
            text-xs font-semibold
          ">
            {user?.username?.[0] || "A"}
          </div>

          {/* Name */}
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.username || "Admin"}
          </span>

          <ChevronDown size={16} className="text-gray-400" />

        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="
            absolute right-0 mt-2 w-44
            bg-white border border-gray-200
            rounded-xl shadow-md
            overflow-hidden
          ">

            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              {user?.username} ({user?.role})
            </div>

            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-2
                px-4 py-2 text-sm text-red-600
                hover:bg-gray-50 transition
              "
            >
              <LogOut size={14} />
              Logout
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Navbar;