import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function MainLayout({ children }) {

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <div className="
          flex-1 overflow-y-auto
          px-6 py-5
        ">
          {children}
        </div>

      </div>

    </div>
  );
}

export default MainLayout;