/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import useClickOutside from "../hooks/useClickOutside";

const DotOptions = ({ doc, setRefresh }: any) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null!);

  useClickOutside(menuRef, () => setOptionsOpen(false));

  const handleDelete = async () => {
    
    setRefresh((prev: boolean) => !prev);
    setOptionsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div
        className="p-2 hover:bg-gray-200 hover:rounded-full"
        onClick={() => setOptionsOpen((prev) => !prev)}
      >
        <BsThreeDotsVertical className="text-xl" />
      </div>

      {optionsOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-md rounded-md p-2 z-10">
          <ul>
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer">Rename</li>
            <a href={`/app/document/${doc.docId}`} target="_blank" rel="noopener noreferrer">
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                Open in new tab
              </li>
            </a>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DotOptions;
