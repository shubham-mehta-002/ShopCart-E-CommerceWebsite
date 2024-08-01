import { Oval } from "react-loader-spinner";

export function Loader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Oval
        visible={true}
        height="60"
        width="60"
        color="#4fa94d"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
