import Login from "@/components/login";
import Signup from "@/components/signup";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {UrlState} from "@/context";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Link2, Sparkles} from "lucide-react";

function Auth() {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {isAuthenticated, loading} = UrlState();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="pt-12 pb-20 flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
            <Link2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {longLink ? "Sign in to Shorten Link" : "Welcome Back"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your secure dashboard, analytics, and custom QR codes
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4">
            <TabsTrigger
              value="login"
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-xs text-xs sm:text-sm py-2"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-xs text-xs sm:text-sm py-2"
            >
              Create Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Auth;
