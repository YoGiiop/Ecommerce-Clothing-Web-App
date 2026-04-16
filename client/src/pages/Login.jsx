import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Log In");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try{
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registration successful");
        } else {
          // ...existing code...
          toast.error(response.data.message);
        }
      }
      else{
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful");
        } else {
          // ...existing code...
          toast.error(response.data.message);
        }
      }
    }
    catch(error){
      // ...existing code...
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if(token){
      navigate('/')
    }
  }, [token]);

  return (
    <div className="mx-auto mt-10 w-full max-w-5xl px-4 sm:mt-14 sm:px-6">
      <div className="grid overflow-hidden rounded-[28px] border border-stone-200 bg-gradient-to-br from-stone-50 via-white to-stone-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.08),_transparent_45%),linear-gradient(160deg,#111827,#292524)] px-10 py-12 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Forever</p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">Style that stays sharp beyond the checkout.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              Sign in to track orders, save your favorites, and keep your shopping experience seamless across devices.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70">Need to manage inventory, products, and order fulfillment?</p>
            <a
              href={adminUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
            >
              Open Admin Portal
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 px-5 py-8 text-gray-800 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
          action=""
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <p className="prata-regular text-3xl">{currentState}</p>
                <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
              </div>
              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                {currentState === "Log In"
                  ? "Welcome back. Sign in to continue shopping and manage your account."
                  : "Create your account to save orders, access your cart, and shop faster next time."}
              </p>
            </div>

            {currentState === "Log In" && (
              <a
                href={adminUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-700 transition hover:border-black hover:text-black lg:hidden"
              >
                Admin
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {currentState === "Log In" ? null : (
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Full name"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                required
              />
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-black"
              required
            />
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="text-left transition hover:text-black">
              Forgot your Password?
            </button>
            {currentState === "Log In" ? (
              <button
                type="button"
                className="text-left font-medium text-gray-800 transition hover:text-black sm:text-right"
                onClick={() => setCurrentState("Sign Up")}
              >
                Create an account
              </button>
            ) : (
              <button
                type="button"
                className="text-left font-medium text-gray-800 transition hover:text-black sm:text-right"
                onClick={() => setCurrentState("Log In")}
              >
                Log In Here
              </button>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-stone-800"
          >
            {currentState === "Log In" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
