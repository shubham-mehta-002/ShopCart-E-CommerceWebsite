import { TailSpin } from "react-loader-spinner";

export function Loader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <TailSpin
        visible={true}
        height="60"
        width="60"
        color="#6495ED"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
