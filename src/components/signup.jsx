import {useEffect, useState} from "react";
import Error from "./error";
import {Input} from "./ui/input";
import * as Yup from "yup";
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
import {signup} from "@/db/apiAuth";
import {BeatLoader} from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {UrlState} from "@/context";
import {User, Mail, Lock, ArrowRight, Upload} from "lucide-react";

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const {loading, error, fn: fnSignup, data} = useFetch(signup, formData);
  const {fetchUser} = UrlState();

  useEffect(() => {
    if (error === null && data) {
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data]);

  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .min(2, "Name must be at least 2 characters")
          .required("Full name is required"),
        email: Yup.string()
          .email("Please provide a valid email address")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, {abortEarly: false});
      await fnSignup();
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
        <CardTitle className="text-xl font-bold text-slate-900">Create an Account</CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Get started with enterprise link analytics and branded QR codes
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="name"
              type="text"
              placeholder="Alex Johnson"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 border-slate-200 focus-visible:ring-indigo-500 text-slate-900 h-11"
            />
          </div>
          {errors.name && <Error message={errors.name} />}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="email"
              type="email"
              placeholder="alex@example.com"
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
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 border-slate-200 focus-visible:ring-indigo-500 text-slate-900 h-11"
            />
          </div>
          {errors.password && <Error message={errors.password} />}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            Profile Picture (Optional)
          </label>
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="border-slate-200 file:text-xs file:font-semibold file:text-indigo-600 file:bg-indigo-50 file:border-0 file:rounded-md file:mr-3 h-11 pt-2 cursor-pointer text-xs text-slate-500"
          />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          onClick={handleSignup}
          disabled={loading}
          className="w-full h-11 font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all gap-2"
        >
          {loading ? (
            <BeatLoader size={8} color="white" />
          ) : (
            <>
              Create Account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
