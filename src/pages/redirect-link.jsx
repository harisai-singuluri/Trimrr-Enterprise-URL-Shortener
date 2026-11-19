import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {BarLoader} from "react-spinners";
import {AlertTriangle, ShieldAlert, ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";

const RedirectLink = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const {loading, data, error, fn} = useFetch(getLongUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      if (data.has_password) {
        navigate(`/unlock/${id}`, {replace: true});
        return;
      }

      if (!data.is_active || data.is_expired) {
        return;
      }

      storeClicks({
        id: data.id,
        originalUrl: data.original_url,
      });
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BarLoader width={220} color="#4F46E5" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Redirecting you securely...
        </p>
      </div>
    );
  }

  if (error || (data && (!data.is_active || data.is_expired))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Link Unavailable or Expired
        </h2>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          {error?.message || "This link has reached its self-destruct click limit, passed its expiration timestamp, or was paused by its owner."}
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  return null;
};

export default RedirectLink;
