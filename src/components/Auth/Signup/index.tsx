"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import api from "@/api";

import InputField from "@/components/shared/InputField";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: "onTouched",
  });

  const password = watch("password");

  const registerHandler = async (data: SignupFormData) => {
    setLoader(true);

    try {
      await api.post("/register", {
        name: data.name,

        email: data.email,

        password: data.password,

        password_confirmation: data.confirmPassword,
      });

      toast.success("Account created successfully!");

      reset();

      router.push("/signin");
    } catch (err: any) {
      // Laravel validation errors
      if (err?.response?.status === 422) {
        const validationErrors = err.response.data.errors;

        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof SignupFormData, {
            type: "server",

            message: validationErrors[field][0],
          });
        });

        toast.error("Please fix the form errors.");

        return;
      }

      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
          {/* Heading */}
          <div className="text-center mb-11">
            <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
              Register Here
            </h2>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4.5">
            <button
              type="button"
              className="flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2"
            >
              Sign Up with Google
            </button>
          </div>

          {/* Divider */}
          <span className="relative z-1 block font-medium text-center mt-4.5">
            <span className="block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3"></span>

            <span className="inline-block px-3 bg-white">Or</span>
          </span>

          {/* Form */}
          <div className="mt-5.5">
            <form onSubmit={handleSubmit(registerHandler)}>
              <InputField<SignupFormData>
                label="Full Name"
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                register={register}
                errors={errors}
              />

              <InputField<SignupFormData>
                label="Password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                minLength={6}
                register={register}
                errors={errors}
              />

              <InputField<SignupFormData>
                label="Re-type Password"
                id="confirmPassword"
                type="password"
                placeholder="Re-type your password"
                required
                register={register}
                errors={errors}
                validate={(value) =>
                  value === password || "Passwords do not match"
                }
              />

              {/* Submit */}
              <button
                disabled={loader}
                type="submit"
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-70"
              >
                {loader ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login */}
              <p className="text-center mt-6">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-dark ease-out duration-200 hover:text-blue pl-2"
                >
                  Sign in Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
