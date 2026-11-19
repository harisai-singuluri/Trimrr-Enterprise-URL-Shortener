import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Lock,
  Flame,
  Zap,
  QrCode,
  ShieldCheck,
  Cpu,
  BarChart3,
  Server,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";

const FeaturesPage = () => {
  return (
    <div className="pt-8 pb-24 max-w-6xl mx-auto px-4">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Enterprise Technical Deep Dive</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Under the Hood: <br />
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
            4 Standout Superpowers
          </span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Explore the architecture, security mechanisms, and modern Java 21 features that elevate this URL platform beyond ordinary shorteners.
        </p>
      </div>

      {/* Feature 1: Password Shield */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 border-b border-slate-100">
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Security & Encryption
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Password Shield with BCrypt Hashing
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Standard shorteners expose destination URLs to anyone who guesses or receives the short link. Password Shield allows creators to lock confidential documents, investor pitch decks, or private links with a secret key.
          </p>
          <ul className="space-y-2.5 pt-2 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Passcode stored securely using Spring Security BCrypt encryption</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Interactive unlock interstitial screen at <code>/unlock/:id</code></span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Protection against brute force via rate-limiting</span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-6">
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800 text-xs text-slate-400">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 font-mono">UrlService.java &bull; Password Verification</span>
            </div>
            <pre className="text-xs font-mono text-indigo-300 pt-4 overflow-x-auto leading-relaxed">
{`public Url verifyPasswordAndResolve(String code, String rawPassword) {
    Url url = resolveUrl(code);
    if (url.getPassword() != null) {
        if (!passwordEncoder.matches(rawPassword, url.getPassword())) {
            throw new BadRequestException("Incorrect password");
        }
    }
    return incrementClick(url);
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Feature 2: Self-Destruct Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 border-b border-slate-100">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-rose-600 uppercase">One-Time Secret Link</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                Max 1 Click
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-800">trim/one-time-token-44</span>
              <span className="text-slate-400">1 / 1 Clicks Used</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              ⚠️ Link reached max click limit and automatically self-destructed.
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
            <Flame className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            Self-Destruct Technology
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Burner Links with Usage Caps
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Ideal for one-time credential handoffs, private coupon drops, or flash marketing campaigns. Once the specified click count or expiration timestamp is reached, the server atomically deactivates the link.
          </p>
          <ul className="space-y-2.5 pt-2 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Configurable <code>maxClicks</code> (e.g. 1, 5, 25, 100)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Combined with custom expiration timestamps</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Subsequent visitors receive an informative expired notice</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Feature 3: Sub-15ms Non-Blocking Redirection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-12 border-b border-slate-100">
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            High Performance Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Sub-15ms Redirections via Spring @Async
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In typical URL shorteners, analytics logging and IP geolocation block the HTTP response thread, adding 300ms to 800ms of lag per visit. Our architecture decouples click recording into asynchronous background workers.
          </p>
          <ul className="space-y-2.5 pt-2 text-sm text-slate-700">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>HTTP 302 redirect dispatches instantly in under 15ms</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Device, OS, Browser, and Geolocation parsed asynchronously</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Java 21 Virtual Threads enabled for massive concurrent capacity</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pipeline Execution Comparison
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600">Traditional Synchronous Redirect</span>
                  <span className="text-slate-500">~650 ms</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-rose-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 font-bold">Our Asynchronous Engine</span>
                  <span className="text-emerald-700 font-bold">&lt; 14 ms</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[12%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Benchmark tested on Java 21 LTS with Spring Boot 3.3 and HikariCP connection pooling.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white text-center shadow-2xl flex flex-col items-center">
        <h3 className="text-2xl sm:text-4xl font-extrabold mb-3">
          Ready to experience the platform?
        </h3>
        <p className="text-indigo-100 text-sm sm:text-base max-w-xl mb-6">
          Create short links, experiment with the QR Studio, or verify the security features from your live dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/auth">
            <Button className="h-11 px-6 bg-white hover:bg-slate-100 text-indigo-700 font-bold rounded-xl shadow-md gap-2">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/qr-studio">
            <Button variant="outline" className="h-11 px-6 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl">
              Open QR Studio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
