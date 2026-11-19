import Header from "@/components/header";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-4 max-w-7xl flex-1 flex flex-col">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <footer className="border-t border-slate-100 bg-slate-50/70 py-6 text-center text-slate-500 text-sm mt-12">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-400">
            Enterprise URL Platform &bull; Java Spring Boot & React
          </p>
          <p className="font-medium text-slate-600">
            💼 Built by <strong>SHS</strong> 🚀
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
