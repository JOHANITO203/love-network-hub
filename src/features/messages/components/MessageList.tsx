interface MessageListItem {
  id: string;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  unreadCount?: number;
  status?: "online" | "offline" | "typing";
}

interface MessageListProps {
  items: MessageListItem[];
  onSelect?: (id: string) => void;
}

export const MessageList = ({ items, onSelect }: MessageListProps) => {
  return (
    <div className="mt-6 space-y-4">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item.id)}
          className="flex w-full items-center gap-4 rounded-[18px] border border-[#EEEFF5] bg-white px-4 py-3 text-left transition hover:border-[#E94057]/40"
        >
          <div className="relative">
            <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
            {item.status === "online" ? (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#4BD37B]" />
            ) : null}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-[#1F1F33]">{item.name}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#C7C8D5]">{item.time}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-[#8C8D9E]">
              <span className="truncate">
                {item.status === "typing" ? "Typing..." : item.preview}
              </span>
              {item.unreadCount ? (
                <span className="ml-3 min-w-[24px] rounded-full bg-[#E94057] px-2 py-0.5 text-center text-xs font-semibold text-white">
                  {item.unreadCount}
                </span>
              ) : null}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
