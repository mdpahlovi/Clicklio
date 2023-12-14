import { HashLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="w-full h-[512px] flex justify-center items-center">
            <HashLoader size={100} />
        </div>
    );
}
