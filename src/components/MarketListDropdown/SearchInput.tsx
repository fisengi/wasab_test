import React, { useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

type Props = {
    query: string;
    setQuery: (query: string) => void;
    autoFocus?: boolean;
};

function SearchInput({ query, setQuery, autoFocus = false }: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <div
            className="mb-4 flex h-10 w-full items-center rounded-full border border-[#62666a] px-3
                 focus-within:ring-1 focus-within:ring-[#94ff0b] transition-colors "
        >
            <AiOutlineSearch
                className="mr-2 h-5 w-5 shrink-0 text-gray-400"
                aria-hidden="true"
            />
            <input
                type="text"
                aria-label="Search markets"
                placeholder="Search Markets"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") setQuery("");
                }}
                ref={inputRef}
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
            />
            {query && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                    <IoMdClose className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export default SearchInput;
