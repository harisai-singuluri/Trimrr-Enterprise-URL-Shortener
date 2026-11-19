import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {logout} from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {Link2, LinkIcon, LogOut, LayoutDashboard, QrCode, Layers, Home, Sparkles} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {BarLoader} from "react-spinners";
import {Button} from "./ui/button";
import {UrlState} from "@/context";

const Header = () => {
  const {loading, fn: fnLogout} = useFetch(logout);
  const navigate = useNavigate();
  const location = useLocation();
  const {user, fetchUser} = UrlState();

  const userInitials = (user?.user_metadata?.name || user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="py-4 border-b border-slate-100 flex items-center justify-between mb-6 sm:mb-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:bg-indigo-700 transition">
            <Link2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
              Trimrr<span className="text-indigo-600">.</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              URL Platform
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-50/80 border border-slate-200/80 p-1 rounded-xl">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isActive("/")
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            Home
          </Link>
          <Link
            to="/qr-studio"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              isActive("/qr-studio")
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-violet-600" />
            QR Studio
          </Link>
          <Link
            to="/features"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              isActive("/features")
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Features & Docs
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                isActive("/dashboard")
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3">
          <Link to="/qr-studio" className="md:hidden">
            <Button variant="ghost" size="sm" className="h-9 px-2 text-slate-600">
              <QrCode className="w-4 h-4 text-violet-600" />
            </Button>
          </Link>

          {!user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-700 border-slate-200 h-10 px-4 rounded-xl hover:bg-slate-50"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/auth")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-4 h-10 text-xs shadow-xs transition"
              >
                Get Started
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" /> My Links
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 hover:border-indigo-400 transition cursor-pointer flex items-center justify-center bg-indigo-50 text-indigo-700 font-bold text-xs shadow-xs">
                    {user?.user_metadata?.profile_pic ? (
                      <img
                        src={user.user_metadata.profile_pic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5" align="end">
                  <DropdownMenuLabel className="font-semibold text-slate-800 text-sm py-2 px-2.5">
                    <p className="truncate">{user?.user_metadata?.name || user?.name}</p>
                    <p className="text-xs font-normal text-slate-400 truncate">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg py-2 px-2.5 flex items-center gap-2"
                  >
                    <LinkIcon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>My Short Links</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/qr-studio")}
                    className="cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg py-2 px-2.5 flex items-center gap-2"
                  >
                    <QrCode className="h-3.5 w-3.5 text-violet-600" />
                    <span>Custom QR Studio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/features")}
                    className="cursor-pointer text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg py-2 px-2.5 flex items-center gap-2"
                  >
                    <Layers className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Features & Architecture</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser();
                        navigate("/auth");
                      });
                    }}
                    className="cursor-pointer text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg py-2 px-2.5 flex items-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#4F46E5" />}
    </>
  );
};

export default Header;
