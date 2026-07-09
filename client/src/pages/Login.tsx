import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-8.5 px-5 flex flex-col gap-3.75 h-screen font-inter">
      <div className="flex items-center gap-1.5">
        <img src="/logo.png" alt="" className="w-13.75 h-12.5" />
        <h1 className="font-semibold text-3xl">Study Track</h1>
      </div>
      <div className="flex">
        <img src="/login.png" alt="" className="w-[50%] h-full" />
        <div className=" flex flex-col gap-10.5 justify-center  max-w-132.5 p-22">
          <div className="flex flex-col gap-3.5">
            <h2 className="font-black text-2xl">Welcome back, Yash</h2>
            <p className="text-sm font-normal text-black">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7 w-full">
            <div className="flex flex-col gap-1.5">
              <input
                {...register("email", { required: "This is required field" })}
                placeholder="Email"
                className="py-3 w-full border-b border-stone-400 bg-white pl-1"
              />
              <p className="text-red-500 font-inter font-bold">
                {errors.email?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <input
                {...register("password", {
                  required: "This is required field",
                })}
                type="password"
                placeholder="Password"
                className="py-3 w-full border-b border-stone-400 bg-white pl-1"
              />
              <p className="text-red-500 font-inter font-bold">
                {errors.password?.message}
              </p>
            </div>

            <button
              disabled={loginMutation.isPending}
              type="submit"
              className="bg-zinc-950 text-white py-5 px-9 rounded-md">
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex gap-2 justify-center">
            <p>Don’t have an account?</p>
            <Link to="/register">Sign up for free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
