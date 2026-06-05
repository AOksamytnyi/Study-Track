type AddSessionButtonProps = {
  onClick?: () => void;
};

export function AddSessionButton({ onClick }: AddSessionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add session"
      className="w-90.75 h-50 flex justify-center items-center rounded-lg outline-2 -outline-offset-2 outline-dashed outline-neutral-500">
      <img src="/plus.svg" alt="" />
    </button>
  );
}
