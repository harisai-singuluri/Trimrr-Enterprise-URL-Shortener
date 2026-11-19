import {useState} from "react";
import {useParams, Link} from "react-router-dom";
import {unlockUrl} from "@/db/apiUrls";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Lock, KeyRound, ArrowRight, ArrowLeft, ShieldCheck, Eye, EyeOff} from "lucide-react";

const UnlockPage = () => {
  const {id} = useParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the passcode.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await unlockUrl({code: id, password});
      if (response && response.originalUrl) {
        window.location.href = response.originalUrl;
      } else {
        throw new Error("Unable to resolve destination.");
      }
    } catch (err) {
      setError(err?.message || "Incorrect passcode. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md border-slate-200/90 shadow-xl bg-white backdrop-blur-sm rounded-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Protected Link
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm mt-1">
            This short link is encrypted with a passcode. Enter the secret key to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4 pt-2">
            {error && (
              <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                <KeyRound className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter passcode..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 h-12 text-base border-slate-200 focus-visible:ring-indigo-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all rounded-xl gap-2"
            >
              {loading ? (
                "Unlocking..."
              ) : (
                <>
                  Unlock & Redirect <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="pt-2 text-center">
              <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600 inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Homepage
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnlockPage;
