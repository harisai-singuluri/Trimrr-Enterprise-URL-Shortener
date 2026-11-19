import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {QrCode, Download, Sparkles, Copy, Check, Palette, ArrowRight, RefreshCw} from "lucide-react";
import {previewQr} from "@/db/apiUrls";

const QR_PALETTES = [
  {name: "Indigo Modern", fg: "#4F46E5", bg: "#FFFFFF"},
  {name: "Emerald Green", fg: "#059669", bg: "#FFFFFF"},
  {name: "Sunset Purple", fg: "#7C3AED", bg: "#FDF4FF"},
  {name: "Cyber Black", fg: "#0F172A", bg: "#FFFFFF"},
  {name: "Rose Pink", fg: "#E11D48", bg: "#FFF1F2"},
  {name: "Ocean Blue", fg: "#0284C7", bg: "#F0F9FF"},
];

const QrStudioPage = () => {
  const [text, setText] = useState("https://github.com");
  const [fgColor, setFgColor] = useState("#4F46E5");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 250);
    return () => clearTimeout(timer);
  }, [text, fgColor, bgColor]);

  const generateQR = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const base64 = await previewQr({text, fgColor, bgColor});
      if (base64) {
        setQrDataUrl(base64);
      }
    } catch (err) {
      console.error("QR generation via Java backend failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = "branded-qr-code.png";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-8 pb-20 max-w-6xl mx-auto px-4">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
          <Palette className="w-4 h-4 text-violet-600" />
          <span>Branded QR Code Studio &bull; Java ZXing Powered</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          Design Custom, High-Res <br />
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Branded QR Codes
          </span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Generate pixel-perfect QR codes matching your exact brand palette. Rendered server-side by our Java 21 ZXing engine with instant 300 DPI PNG exports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Target URL or Text Content
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="https://your-portfolio.com"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-12 border-slate-200 focus-visible:ring-indigo-500 text-slate-900"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-12 px-3 text-xs text-slate-600"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Color Customization */}
          <div className="flex flex-col gap-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" /> Custom Color Scheme
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-700">QR Pattern</span>
                  <span className="text-[11px] font-mono text-slate-400">{fgColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-700">Background</span>
                  <span className="text-[11px] font-mono text-slate-400">{bgColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Palettes */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Preset Palette Styles
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {QR_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => {
                    setFgColor(palette.fg);
                    setBgColor(palette.bg);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition text-xs font-medium text-slate-700"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-xs shrink-0"
                    style={{backgroundColor: palette.fg}}
                  />
                  <span className="truncate">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center">
          <div className="w-full pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Server Rendered &bull; 350x350
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Java ZXing Engine
            </span>
          </div>

          {/* QR Container */}
          <div
            className="p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center transition-all min-h-[250px]"
            style={{backgroundColor: bgColor}}
          >
            {loading ? (
              <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                Rendering on Java backend...
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Branded QR Code"
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                Enter text to preview
              </div>
            )}
          </div>

          <div className="w-full flex flex-col gap-2.5">
            <Button
              onClick={handleDownload}
              disabled={!qrDataUrl || loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all gap-2"
            >
              <Download className="w-4 h-4" /> Download High-Resolution PNG
            </Button>
            <p className="text-[11px] text-slate-400">
              300 DPI Base64 PNG generated directly by Spring Boot backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrStudioPage;
