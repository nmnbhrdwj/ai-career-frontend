import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { features } from "../utils";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useAppData();

  const handleEmailLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(`${server}/api/user/email-login`, {
        email,
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Problem while login");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (authResult: any) => {
    setLoading(true);
    try {
      const code = authResult["code"] || "demo";
      const result = await axios.post(`${server}/api/user/login`, {
        code,
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setLoading(false);
      setUser(result.data.user);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Problem while login");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: handleGoogleLogin,
    flow: "auth-code",
  });

  return (
    <div className="bg-page flex items-center justify-center p-4">
      <div className="orb w-96 h-96 bg-indigo-500 -top-20 -left-20" />
      <div className="orb w-80 h-80 bg-emerald-500 bottom-10 right-0" />
      <div className="orb w-64 h-64 bg-violet-600 top-1/2 left-1/2 -translate-x-1/2" />

      <div className="glass-card w-full max-w-md p-10 flex flex-col items-center gap-8 z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-3xl">
            📚
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient">
            CareerAI
          </h1>
          <p className="text-white/40 text-sm leading-relaxed text-gradient">
            Your AI-powered career co-pilot - build, analyse, and land your
            next role.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {features.map(({ icon: Icon, label }) => (
            <span key={label} className="feature-pill">
              <Icon size={11} className="text-indigo-400" />
              {label}
            </span>
          ))}
        </div>

        <div className="divider-subtle"></div>

        <div className="w-full flex flex-col gap-3">
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-2.5">
            <label className="text-xs text-white/40 font-medium">Enter Your Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 23ucc576@lnmiit.ac.in"
              className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "✉️ Sign In with Email"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Or</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <button
            className="btn-google"
            onClick={googleLogin}
            disabled={loading}
          >
            {loading ? (
              <p className="text-gray-400 animate-pulse">Please Wait...</p>
            ) : (
              <>
                <img src="/google.svg" alt="" className="w-4 h-4" /> Sign in
                with Google
              </>
            )}
          </button>

          <button
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            onClick={() => handleGoogleLogin({ code: "demo" })}
            disabled={loading}
          >
            ⚡ Quick Guest / Demo Login
          </button>
        </div>

        <div className="text-[11px] text-white/25 text-center leading-relaxed">
          By signing in you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-white/50 transition-colors"
          >
            Terms
          </a>{" "}
          {"&"}{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-white/50 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
