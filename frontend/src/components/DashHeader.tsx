import { useRef, useState } from "react";
import logo from "../public/logo.svg";
import useClickOutside from "../hooks/useClickOutside";
import { SearchIcon, XIcon } from "lucide-react";

const DashHeader = ({ username }: { username: string | null }) => {
  const menuRef = useRef<HTMLDivElement>(null!);
  const [optionsOpen, setOptionsOpen] = useState(false);

  useClickOutside(menuRef, () => setOptionsOpen(false));

  const handleLogout = async () => {};

  return (
    <div className="w-full flex flex-col items-center mt-2 overflow-x-hidden">
      <div className="w-full flex items-center justify-between px-10">
        <div className="flex gap-3 items-center">
          <img src={logo} alt="collabwrite_logo" className="w-[45px]" />
          <h1 className="text-2xl font-light">CollabWrite</h1>
        </div>

        {/* <div className="w-[55%] flex items-center bg-gray-200 rounded-s-full rounded-e-full">
          <label htmlFor="" className="bg-gray-200 ps-4 rounded-s-full">
            <IoMdSearch className="size-6 text-gray-700" />
          </label>
          <input
            type="text"
            name=""
            id=""
            placeholder="Search"
            className="w-full bg-gray-200 py-2 px-4 rounded-e-full"
          />
        </div> */}

        <div className="flex-1 flex items-center justify-center">
          <div className="relative max-w-[720px] w-full">
            <input
              placeholder="Search"
              className="md:text-base placeholder:text-neutral-500 px-14 w-full border border-gray-200 outline-none shadow-sm hover:shadow-md focus:shadow-lg focus:border-gray-400 focus:bg-white bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 transition-all duration-200"
              // className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)] bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
              style={{ outline: "none" }}
            />
            <button className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full border-none">
              <SearchIcon />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
            >
              <XIcon />
            </button>
          </div>
        </div>

        <div className="flex gap-2 text-lg" ref={menuRef}>
          <div
            className="size-12 rounded-full bg-pink-700 text-white flex justify-center items-center text-lg font-medium cursor-pointer"
            onClick={() => setOptionsOpen((prev) => !prev)}
          >
            {username?.slice(0, 1).toUpperCase()}
          </div>

          {optionsOpen && (
            <div className="absolute right-0 top-14 mt-2 w-40 bg-white border border-gray-300 shadow-md rounded-md p-2 z-10">
              <ul className="flex flex-col items-center">
                <li className="p-2 cursor-pointer font-light">
                  <h1>Hi, {username}</h1>
                </li>
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={handleLogout}
                >
                  Log Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashHeader;
