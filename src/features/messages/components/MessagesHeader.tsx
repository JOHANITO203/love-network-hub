import { Search, SlidersHorizontal } from "lucide-react";

interface MessagesHeaderProps {
  onFilter?: () => void;
}

export const MessagesHeader = ({ onFilter }: MessagesHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-[#1F1F33]">Messages</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8C8D9E]">
            Search, filter and keep track of your conversations.
          </p>
        </div>
        <button
          type="button"
          onClick={onFilter}
          className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#EEEFF5] text-[#E94057] shadow-[0_10px_24px_rgba(233,64,87,0.08)]"
          aria-label="Filter messages"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C7C8D5]" />
        <input
          type="search"
          placeholder="Search"
          className="h-14 w-full rounded-[18px] border border-[#EEEFF5] bg-white pl-12 pr-4 text-base text-[#1F1F33] placeholder:text-[#C7C8D5] focus:border-[#E94057] focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
};
