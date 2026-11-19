import {useEffect, useState} from "react";
import {BarLoader} from "react-spinners";
import {Filter, Link2, MousePointerClick, ShieldCheck, Sparkles, Search} from "lucide-react";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {CreateLink} from "@/components/create-link";
import LinkCard from "@/components/link-card";
import Error from "@/components/error";

import useFetch from "@/hooks/use-fetch";
import {getUrls} from "@/db/apiUrls";
import {getClicksForUrls} from "@/db/apiClicks";
import {UrlState} from "@/context";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {user} = UrlState();
  const {loading, error, data: urls, fn: fnUrls} = useFetch(getUrls, user?.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.short_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (url.custom_url && url.custom_url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalClicksCount = urls?.reduce((sum, u) => sum + (u.click_count || 0), 0) || clicks?.length || 0;
  const activeLinksCount = urls?.filter((u) => u.is_active && !u.is_expired)?.length || 0;

  return (
    <div className="flex flex-col gap-8 pt-6 pb-16">
      {/* Loading bar */}
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#4F46E5" />
      )}

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Links */}
        <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Links Created
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Link2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{urls?.length || 0}</div>
            <p className="text-xs text-slate-400 mt-1">Short links in your workspace</p>
          </CardContent>
        </Card>

        {/* Total Clicks */}
        <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Total Visits
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{totalClicksCount}</div>
            <p className="text-xs text-slate-400 mt-1">Real-time aggregate link clicks</p>
          </CardContent>
        </Card>

        {/* Active Links */}
        <Card className="border border-slate-200/90 bg-white shadow-xs rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Active Links
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{activeLinksCount}</div>
            <p className="text-xs text-slate-400 mt-1">Live links ready for redirection</p>
          </CardContent>
        </Card>
      </div>

      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Link Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your shortened links, monitor click traffic, and customize QR codes.
          </p>
        </div>
        <CreateLink />
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by title, short code, or custom alias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white border-slate-200 text-slate-900 focus-visible:ring-indigo-500 rounded-xl"
        />
      </div>

      {error && <Error message={error?.message} />}

      {/* List of Links */}
      <div className="flex flex-col gap-4">
        {filteredUrls && filteredUrls.length > 0 ? (
          filteredUrls.map((url, i) => (
            <LinkCard key={url.id || i} url={url} fetchUrls={fnUrls} />
          ))
        ) : !loading ? (
          <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No links found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "No links matched your search term. Try a different query."
                : "You haven't shortened any links yet. Click 'Create Short Link' above to get started!"}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
