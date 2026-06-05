import { useForm, type SubmitHandler } from "react-hook-form";
import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
  username: string;
};

export default function Register() {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const response = await registerUser(data);
      setAuth(response.token, response.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8.5 px-5 flex flex-col gap-3.75 h-screen font-inter">
      <div className="flex items-center gap-1.5">
        <img src="/logo.png" alt="" className="w-13.75 h-12.5" />
        <h1 className="font-semibold text-3xl">Study Track</h1>
      </div>
      <div className="flex">
        <img src="/register.jpg" alt="" className="w-[50%] h-full" />
        <div className=" flex flex-col gap-10.5 justify-center  max-w-132.5 p-22">
          <div className="flex flex-col gap-3.5">
            <h2 className="font-black text-2xl">Welcome! Create account</h2>
            <p className="text-sm font-normal text-black">
              Please enter your details.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-1.5">
              <input
                {...register("username", { required: "This is required field" })}
                placeholder="Username"
                className="py-3 w-full border-b border-stone-400 bg-white pl-1"
              />
              <p className="text-red-500 font-inter font-bold">
                {errors.username?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <input
                {...register("email", {
                  required: "This is required field",
                })}
                placeholder="Email"
                className="py-3 w-full border-b border-stone-400 bg-white pl-1"
              />
              <p className="text-red-500 font-inter font-bold">
                {errors.email?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <input
                {...register("password", { required: "This is required field" })}
                type="password"
                placeholder="Password"
                className="py-3 w-full border-b border-stone-400 bg-white pl-1"
              />
              <p className="text-red-500 font-inter font-bold">
                {errors.password?.message}
              </p>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="bg-zinc-950 text-white py-5 px-9 rounded-md mt-3 disabled:opacity-50">
              Register
            </button>
          </form>

          <div className="flex gap-2 justify-center">
            <p>Have a account?</p>
            <Link to="/login">Log in!</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
