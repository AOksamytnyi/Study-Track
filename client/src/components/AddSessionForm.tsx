import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { type Difficulty } from "../api/session";
import { useCreateSession } from "../hooks/useSessions";

type Inputs = {
  title: string;
  description: string;
  date: string;
  duration: number;
  difficulty: Difficulty;
};

type AddSessionFormProps = {
  onCancel?: () => void;
  onCreated?: () => void;
};

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const today = new Date().toISOString().split("T")[0];

export function AddSessionForm({ onCancel, onCreated }: AddSessionFormProps) {
  const createSessionMutation = useCreateSession();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      title: "",
      description: "",
      date: today,
      duration: 30,
      difficulty: "easy",
    },
  });

  const selectedDifficulty = useWatch({ control, name: "difficulty" });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createSessionMutation.mutateAsync({
      ...data,
      duration: Number(data.duration),
    });

    reset();
    onCreated?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-90.75 min-h-50 flex flex-col gap-3 rounded-lg bg-white shadow-[0px_0px_3px_1px_rgba(0,0,0,0.15)] p-3.75 font-roboto">
      <div className="flex flex-col gap-px">
        <input
          type="text"
          placeholder="Session title"
          {...register("title", {
            required: "Title is required",
            maxLength: {
              value: 150,
              message: "Title must be 150 characters or less",
            },
          })}
          className="w-full border-b border-stone-400 bg-white py-1.5 pl-1 text-2xl font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-slate-700"
        />
        {errors.title && (
          <p className="pl-1 text-xs font-medium text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <textarea
        placeholder="What did you study?"
        rows={2}
        {...register("description", {
          maxLength: {
            value: 2000,
            message: "Description must be 2000 characters or less",
          },
        })}
        className="min-h-12 w-full resize-none border-b border-stone-400 bg-white py-1.5 pl-1 text-base font-light text-neutral-500 outline-none placeholder:text-neutral-400 focus:border-slate-700"
      />
      {errors.description && (
        <p className="-mt-2 pl-1 text-xs font-medium text-red-500">
          {errors.description.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium uppercase text-neutral-500">
          Date
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="border-b border-stone-400 bg-white py-1.5 text-sm font-light normal-case text-neutral-600 outline-none focus:border-slate-700"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium uppercase text-neutral-500">
          Minutes
          <input
            type="number"
            min={1}
            {...register("duration", {
              required: "Duration is required",
              valueAsNumber: true,
              min: { value: 1, message: "Duration must be positive" },
            })}
            className="border-b border-stone-400 bg-white py-1.5 text-sm font-light normal-case text-neutral-600 outline-none focus:border-slate-700"
          />
        </label>
      </div>

      {errors.date && (
        <p className="-mt-2 pl-1 text-xs font-medium text-red-500">
          {errors.date.message}
        </p>
      )}
      {errors.duration && (
        <p className="-mt-2 pl-1 text-xs font-medium text-red-500">
          {errors.duration.message}
        </p>
      )}

      <div className="flex gap-2">
        {difficultyOptions.map((option) => (
          <label
            key={option.value}
            className={`flex h-8 flex-1 cursor-pointer items-center justify-center rounded-md border text-xs font-bold uppercase transition ${
              selectedDifficulty === option.value
                ? "border-slate-700 bg-slate-700 text-white"
                : "border-neutral-200 bg-white text-neutral-500"
            }`}>
            <input
              type="radio"
              value={option.value}
              {...register("difficulty")}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>

      <div className="mt-auto flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-9 flex-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-500 transition hover:border-neutral-500 hover:text-slate-700">
            Cancel
          </button>
        )}
        <button
          disabled={isSubmitting}
          type="submit"
          className="h-9 flex-1 rounded-md bg-zinc-950 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting || createSessionMutation.isPending
            ? "Saving..."
            : "Add session"}
        </button>
      </div>
    </form>
  );
}
