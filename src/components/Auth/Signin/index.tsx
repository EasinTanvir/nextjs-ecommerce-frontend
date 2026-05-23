"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { FcGoogle } from "react-icons/fc";

import { signIn } from "next-auth/react";
import InputField from "@/components/shared/InputField";

interface SigninFormData {
  email: string;
  password: string;
}

const Signin = () => {
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SigninFormData>({
    mode: "onTouched",
  });

  // Google Login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  // Login Handler
  const loginHandler = async (data: SigninFormData) => {
    setLoader(true);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    //@ts-ignore
    if (!res?.code && !res?.error) {
      router.push("/");
      toast.success("Login Success");
      return;
    }
    setLoader(false);
    toast.error("Invalid Credential");
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2 min-h-screen flex items-center">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] w-full mx-auto rounded-2xl bg-white shadow-1 p-5 sm:p-8 xl:p-11">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="font-semibold text-2xl sm:text-3xl text-dark mb-2">
              Login Here
            </h2>

            <p className="text-dark-4">Sign in to continue </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(loginHandler)}>
            <div className="space-y-5">
              <InputField<SigninFormData>
                label="Email Address"
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                register={register}
                errors={errors}
              />

              <InputField<SigninFormData>
                label="Password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                register={register}
                errors={errors}
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mt-3">
              <Link
                href="/forgot-password"
                className="text-sm text-dark-4 hover:text-blue duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              disabled={loader}
              type="submit"
              className="w-full flex justify-center items-center font-medium text-white bg-dark py-3.5 px-6 rounded-xl ease-out duration-200 hover:bg-blue mt-7 disabled:opacity-70"
            >
              {loader ? "Signing In..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-7">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gray-3"></span>

              <span className="relative z-10 bg-white px-4 text-sm text-dark-4">
                OR
              </span>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-3 rounded-xl border border-gray-3 bg-gray-1 py-3.5 px-5 ease-out duration-200 hover:bg-gray-2"
            >
              <FcGoogle className="text-2xl" />

              <span className="font-medium">Continue with Google</span>
            </button>

            {/* Signup */}
            <p className="text-center mt-7 text-dark-4">
              Don&apos;t have an account?
              <Link
                href="/signup"
                className="text-dark font-medium hover:text-blue duration-200 pl-2"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
