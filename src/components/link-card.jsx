/* eslint-disable react/prop-types */
import {Copy, Check, Download, LinkIcon, Trash2, Eye, EyeOff, Lock, Flame, ExternalLink, Calendar} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import {deleteUrl, toggleUrlStatus} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {useState} from "react";

const LinkCard = ({url: initialUrl, fetchUrls}) => {
  const [url, setUrl] = useState(initialUrl);
  const [copied, setCopied] = useState(false);

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "short-url";

    if (!imageUrl) return;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = `${fileName.replace(/[^a-zA-Z0-9_-]/g, "_")}-qr.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url.id);
  const {loading: loadingToggle, fn: fnToggle} = useFetch(
    toggleUrlStatus,
    {id: url.id}
  );

  const handleToggleStatus = async () => {
    try {
      const newStatus = !url.is_active;
      const res = await fnToggle({id: url.id, isActive: newStatus});
      if (res) {
        setUrl({ ...url, is_active: newStatus });
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
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
    <div className="flex flex-col md:flex-row gap-5 border border-slate-200/90 p-5 bg-white rounded-2xl transition duration-200 hover:border-indigo-300 hover:shadow-md shadow-xs">
      {/* QR Code Container */}
      <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-100 rounded-xl self-start shrink-0">
        <img
          src={url?.qr}
          className="h-28 w-28 object-contain rounded-md"
          alt="QR code"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={downloadImage}
          className="mt-2 text-xs h-7 px-2.5 bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
        >
          <Download className="h-3 w-3 mr-1 text-slate-500" /> Save QR
        </Button>
      </div>

      {/* Main Info */}
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/link/${url?.id}`}
            className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-indigo-600 transition truncate"
          >
            {url?.title}
          </Link>

          {/* Status Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              url.is_active && !url.is_expired
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {url.is_expired ? "Expired" : url.is_active ? "Active" : "Paused"}
          </span>

          {/* Password Badge */}
          {url.has_password && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Lock className="w-3 h-3" /> Protected
            </span>
          )}

          {/* Burner / Max Clicks Badge */}
          {url.max_clicks && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600" />
              {url.click_count || 0}/{url.max_clicks} Clicks
            </span>
          )}
        </div>

        {/* Short Link */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl transition">
            <LinkIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <a
              href={fullShortLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm sm:text-base font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {displayShortLink}
            </a>
            <button
              onClick={copyToClipboard}
              className="p-1 rounded-md text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 transition shrink-0 ml-1"
              title="Copy Short Link"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Original Destination */}
        <a
          href={url?.original_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 hover:underline truncate max-w-xl"
        >
          <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
          <span className="truncate">{url?.original_url}</span>
        </a>

        {/* Timestamps & Clicks */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100 mt-auto">
          <span>Created: {new Date(url?.created_at).toLocaleDateString()}</span>
          <span>&bull;</span>
          <span className="font-medium text-slate-600">Total Visits: {url?.click_count || 0}</span>
          {url?.expires_at && (
            <>
              <span>&bull;</span>
              <span className="text-amber-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Expires: {new Date(url.expires_at).toLocaleDateString()}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleStatus}
          disabled={loadingToggle || url.is_expired}
          className={`h-9 px-3 rounded-lg text-xs font-semibold gap-1.5 transition ${
            url.is_active
              ? "text-slate-700 hover:bg-slate-100"
              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
          }`}
        >
          {loadingToggle ? (
            <BeatLoader size={6} color="#4F46E5" />
          ) : url.is_active ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-500" /> Pause
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-emerald-600" /> Enable
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
          className="h-9 px-3 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-slate-200 hover:border-rose-200 transition"
        >
          {loadingDelete ? <BeatLoader size={6} color="#E11D48" /> : <Trash2 className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
