import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Link2,
  Lock,
  Flame,
  QrCode,
  Zap,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Copy,
  Sparkles,
} from "lucide-react";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl.trim()) {
      navigate(`/auth?createNew=${encodeURIComponent(longUrl.trim())}`);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setLongUrl(text);
    } catch (err) {
      console.log("Clipboard read not permitted:", err);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 sm:pt-14 pb-20">
      {/* Top Highlight Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/90 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs transition hover:bg-indigo-100/70">
        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
        <span>Enterprise URL Shortener &bull; Java Spring Boot & React</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-slate-900 text-center font-black tracking-tight max-w-4xl leading-[1.1] mb-5">
        Shorten Links with <br />
        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
          Superpowers & Security
        </span>
      </h1>

      <p className="text-base sm:text-lg text-slate-600 text-center max-w-2xl mb-8 leading-relaxed">
        Create fast, customizable short URLs with password protection, self-destruct click limits, branded QR code styling, and non-blocking real-time analytics.
      </p>

      {/* Main Shortening Input Card */}
      <form
        onSubmit={handleShorten}
        className="w-full max-w-2xl bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/80 flex flex-col sm:flex-row gap-2 transition-all hover:border-indigo-300"
      >
        <div className="relative flex-1 flex items-center">
          <Link2 className="absolute left-3.5 w-5 h-5 text-slate-400" />
          <Input
            type="url"
            required
            placeholder="Paste your long link here (e.g. https://...)"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="pl-11 pr-14 py-3 h-12 text-sm sm:text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            Paste
          </button>
        </div>
        <Button
          type="submit"
          className="h-12 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all gap-2"
        >
          Shorten Link <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* 4 Feature Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mt-16 px-2">
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3.5">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Password Shield</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Lock confidential URLs with a secret passcode. Visitors enter the key to unlock before redirect.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-3.5">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Self-Destruct Links</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Set a maximum click count or lifespan. Once reached, the link automatically self-destructs.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-3.5">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Custom QR Studio</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Customize QR foreground & background colors dynamically and export high-res PNG codes instantly.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3.5">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Sub-15ms Redirection</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Spring Boot non-blocking asynchronous event processing ensures ultra-low redirect latency.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-4xl mt-20 px-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Everything you need to know about the architecture & features
          </p>
        </div>

        <Accordion type="multiple" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1" className="border border-slate-200/80 rounded-xl px-5 bg-white shadow-xs">
            <AccordionTrigger className="text-slate-900 font-semibold hover:no-underline py-4 text-left">
              How do Password-Protected URLs work?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
              When creating a short link, you can provide an optional password. The Java backend encrypts it using BCrypt. When a visitor opens the link, they are prompted for the passcode on a secure unlock screen before being redirected to the target URL.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-slate-200/80 rounded-xl px-5 bg-white shadow-xs">
            <AccordionTrigger className="text-slate-900 font-semibold hover:no-underline py-4 text-left">
              What is a Self-Destruct / Burner Link?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
              You can configure a link with a maximum click limit (e.g., 1 click for a one-time secret, or 50 clicks for a limited promo). Once the total visits reach the limit, the link automatically deactivates and redirects subsequent visitors to a polite expired notice.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-slate-200/80 rounded-xl px-5 bg-white shadow-xs">
            <AccordionTrigger className="text-slate-900 font-semibold hover:no-underline py-4 text-left">
              What technology stack powers this application?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
              The backend is built with <strong>Java 21, Spring Boot 3, Spring Security 6 with stateless JWT authentication, and Spring Data JPA</strong>. The frontend is built with <strong>React 18, Vite, and Tailwind CSS</strong>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-slate-200/80 rounded-xl px-5 bg-white shadow-xs">
            <AccordionTrigger className="text-slate-900 font-semibold hover:no-underline py-4 text-left">
              How does the QR Code customization work?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-4">
              Using the Google ZXing library inside the Spring Boot backend, the server renders a Base64-encoded PNG image matching the exact foreground and background hex colors you configure in the UI.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default LandingPage;
