import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "./ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import {createUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {UrlState} from "@/context";
import {Lock, Flame, QrCode, Sparkles, Plus, Calendar} from "lucide-react";

export function CreateLink() {
  const {user} = UrlState();
  const navigate = useNavigate();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
    expiresAt: "",
    password: "",
    maxClicks: "",
    qrForegroundColor: "#0F172A",
    qrBackgroundColor: "#FFFFFF",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL starting with http:// or https://")
      .required("Destination URL is required"),
    customUrl: yup.string().nullable(),
    expiresAt: yup.string().nullable(),
    password: yup.string().nullable(),
    maxClicks: yup
      .number()
      .transform((value) => (isNaN(value) || value === "" ? null : value))
      .nullable()
      .min(1, "Click limit must be at least 1"),
    qrForegroundColor: yup.string().nullable(),
    qrBackgroundColor: yup.string().nullable(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {
    ...formValues,
    expiresAt: formValues.expiresAt ? new Date(formValues.expiresAt).toISOString() : null,
    maxClicks: formValues.maxClicks ? parseInt(formValues.maxClicks, 10) : null,
  });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, {abortEarly: false});
      await fnCreateUrl();
    } catch (e) {
      const newErrors = {};
      if (e?.inner) {
        e.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({api: e.message});
      }
    }
  };

  return (
    <Dialog
      defaultOpen={Boolean(longLink)}
      onOpenChange={(isOpen) => {
        if (!isOpen) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100 rounded-xl px-5 h-11 gap-2 transition-all">
          <Plus className="w-4 h-4" /> Create Short Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <DialogTitle className="font-bold text-xl text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Create Secure Short Link
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-3">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Link Title *
            </label>
            <Input
              id="title"
              placeholder="e.g. Portfolio Website or Q3 Presentation"
              value={formValues.title}
              onChange={handleChange}
              className="border-slate-200 focus-visible:ring-indigo-500 text-slate-900"
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          {/* Long URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Destination URL *
            </label>
            <Input
              id="longUrl"
              placeholder="https://example.com/very-long-original-url"
              value={formValues.longUrl}
              onChange={handleChange}
              className="border-slate-200 focus-visible:ring-indigo-500 text-slate-900"
            />
            {errors.longUrl && <Error message={errors.longUrl} />}
          </div>

          {/* Custom Alias */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
              Custom Alias (Optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-lg font-mono">
                trim/
              </span>
              <Input
                id="customUrl"
                placeholder="my-cool-link"
                value={formValues.customUrl}
                onChange={handleChange}
                className="border-slate-200 focus-visible:ring-indigo-500 text-slate-900"
              />
            </div>
            {errors.customUrl && <Error message={errors.customUrl} />}
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-600 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Expiration Date (Optional)
            </label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={formValues.expiresAt}
              onChange={handleChange}
              className="border-slate-200 focus-visible:ring-indigo-500 text-slate-900"
            />
          </div>

          {/* Unique Feature: Password Protection */}
          <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col gap-2">
            <label className="text-xs text-indigo-900 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              Passcode Protection (Optional)
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Set a secret passcode to lock this link"
              value={formValues.password}
              onChange={handleChange}
              className="bg-white border-indigo-200 focus-visible:ring-indigo-500 text-slate-900 text-sm"
            />
            <p className="text-[11px] text-indigo-600/80">
              Visitors must enter this passcode before being redirected.
            </p>
          </div>

          {/* Unique Feature: Burner / Click Limit */}
          <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 flex flex-col gap-2">
            <label className="text-xs text-rose-900 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              Self-Destruct Click Limit (Optional)
            </label>
            <Input
              id="maxClicks"
              type="number"
              min="1"
              placeholder="e.g. 1 for single-use burner link, or 50"
              value={formValues.maxClicks}
              onChange={handleChange}
              className="bg-white border-rose-200 focus-visible:ring-rose-500 text-slate-900 text-sm"
            />
            <p className="text-[11px] text-rose-600/80">
              The link automatically self-destructs after reaching this many clicks.
            </p>
          </div>

          {/* Unique Feature: Custom QR Code Colors */}
          <div className="p-3.5 rounded-xl border border-violet-100 bg-violet-50/50 flex flex-col gap-2">
            <label className="text-xs text-violet-900 font-semibold flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-violet-600" />
              Custom QR Studio Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-violet-200">
                <input
                  type="color"
                  id="qrForegroundColor"
                  value={formValues.qrForegroundColor}
                  onChange={handleChange}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <div className="text-xs text-slate-600">
                  <span className="block font-medium">QR Dots</span>
                  <span className="text-[10px] text-slate-400 font-mono">{formValues.qrForegroundColor}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-violet-200">
                <input
                  type="color"
                  id="qrBackgroundColor"
                  value={formValues.qrBackgroundColor}
                  onChange={handleChange}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <div className="text-xs text-slate-600">
                  <span className="block font-medium">Background</span>
                  <span className="text-[10px] text-slate-400 font-mono">{formValues.qrBackgroundColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <Error message={error.message} />}

        <DialogFooter className="sm:justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-6 h-11 w-full sm:w-auto shadow-md shadow-indigo-100 transition-all"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? <BeatLoader size={8} color="white" /> : "Generate Short Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
