import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0f19] text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;