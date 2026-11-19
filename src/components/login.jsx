import {Input} from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {Button} from "./ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import * as Yup from "yup";
import Error from "./error";
import {login} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import {Mail, Lock, ArrowRight} from "lucide-react";

const Login = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const {loading, error, fn: fnLogin, data} = useFetch(login, formData);
  const {fetchUser} = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data]);

  const handleLogin = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Please provide a valid email address")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnLogin();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xl shadow-slate-100 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-slate-900">Sign In</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your email and password to access your dashboard
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 border-slate-200 focus-visible:ring-indigo-500 text-slate-900 h-11"
            />
          </div>
          {errors.email && <Error message={errors.email} />}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 border-slate-200 focus-visible:ring-indigo-500 text-slate-900 h-11"
            />
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-2">
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-11 font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all gap-2"
        >
          {loading ? (
            <BeatLoader size={8} color="white" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <div className="w-full relative flex items-center justify-center my-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
            or try demo
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData({
              email: "demo@trimrr.com",
              password: "password123",
            });
            setErrors({});
          }}
          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>⚡ Auto-fill Demo Account (demo@trimrr.com)</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default Login;
