import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UrlState} from "@/context";
import {getClicksForUrl} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {
  Copy,
  Check,
  Download,
  LinkIcon,
  Trash2,
  Lock,
  Flame,
  ExternalLink,
  Calendar,
  BarChart2,
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams, Link} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";

const LinkPage = () => {
  const navigate = useNavigate();
  const {user} = UrlState();
  const {id} = useParams();
  const [copied, setCopied] = useState(false);

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "short-url-qr";

    if (!imageUrl) return;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = `${fileName.replace(/[^a-zA-Z0-9_-]/g, "_")}-qr.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const linkCode = url?.custom_url ? url?.custom_url : url?.short_url;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const host = typeof window !== "undefined" ? window.location.host : "trimr.link";
  const fullShortLink = `${origin}/${linkCode}`;
  const displayShortLink = `${host}/${linkCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pt-6 pb-16">
      {(loading || loadingStats) && (
        <BarLoader className="mb-2" width={"100%"} color="#4F46E5" />
      )}

      {/* Back to Dashboard */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Link Metadata & QR Card */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  url?.is_active && !url?.is_expired
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {url?.is_expired ? "Expired" : url?.is_active ? "Active" : "Paused"}
              </span>

              {url?.has_password && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Lock className="w-3 h-3" /> Password Protected
                </span>
              )}

              {url?.max_clicks && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  <Flame className="w-3 h-3 text-amber-600" /> Max {url.max_clicks} Clicks
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 break-words">
              {url?.title}
            </h1>
          </div>

          {/* Short Link Action Bar */}
          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3">
            <a
              href={fullShortLink}
              target="_blank"
              rel="noreferrer"
              className="text-base sm:text-lg text-indigo-700 font-bold hover:underline truncate"
            >
              {displayShortLink}
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 px-3 bg-white border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold gap-1.5 shrink-0 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" /> Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Original Destination */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Destination URL
            </span>
            <a
              href={url?.original_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 hover:underline break-all"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{url?.original_url}</span>
            </a>
          </div>

          {/* Timestamps */}
          <div className="flex flex-col gap-1 text-xs text-slate-400 pt-3 border-t border-slate-100">
            <span>Created on {url?.created_at ? new Date(url.created_at).toLocaleString() : "-"}</span>
            {url?.expires_at && (
              <span className="text-amber-600 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" /> Expires: {new Date(url.expires_at).toLocaleString()}
              </span>
            )}
          </div>

          {/* Branded QR Code Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              Dynamic Branded QR Code
            </div>
            <img
              src={url?.qr}
              className="w-44 h-44 object-contain rounded-lg p-2 bg-white border border-slate-200 shadow-xs"
              alt="QR code"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={downloadImage}
              className="mt-3 text-xs h-9 px-4 rounded-xl bg-white border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Download High-Res PNG
            </Button>
          </div>

          {/* Delete Action */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disabled={loadingDelete}
              className="w-full text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200 h-10 rounded-xl gap-2 transition"
            >
              {loadingDelete ? (
                <BeatLoader size={6} color="#E11D48" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" /> Delete this link
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Detailed Analytics */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" />
                  Performance Analytics
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time breakdown of traffic, devices, and visitor locations
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{stats?.length || url?.click_count || 0}</span>
                <span className="block text-[11px] font-medium text-slate-400">Total Clicks</span>
              </div>
            </CardHeader>

            <CardContent className="pt-6 flex flex-col gap-8">
              {stats && stats.length > 0 ? (
                <>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">
                      Visitor Top Locations
                    </h3>
                    <Location stats={stats} />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">
                      Device Type Distribution
                    </h3>
                    <DeviceStats stats={stats} />
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm">
                  {loadingStats ? "Fetching traffic analytics..." : "No visits recorded yet for this link. Share your link to start tracking!"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LinkPage;
