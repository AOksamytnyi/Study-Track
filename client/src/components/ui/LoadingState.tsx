type LoadingState = {
  text: string;
};

export function LoadingState(props: LoadingState) {
  return (
    <div className="flex justify-center items-center text-center">
      <div className="flex flex-col gap-2">
        <p className="font-nunito text-xl font-bold">{props.text}</p>
        <p className=" text-sm text-gray-400"> Wait a minute!</p>
      </div>
    </div>
  );
}
