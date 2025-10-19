interface StoryItem {
  id: string;
  name: string;
  image: string;
  isActive?: boolean;
  isUser?: boolean;
}

interface ActivityStoriesProps {
  items: StoryItem[];
}

export const ActivityStories = ({ items }: ActivityStoriesProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-base font-semibold text-[#1F1F33]">Activities</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-[72px] flex-col items-center gap-2"
          >
            <div
              className={`relative h-[72px] w-[72px] rounded-full border-[3px] ${
                item.isActive ? "border-[#E94057]" : "border-[#EEEFF5]"
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full rounded-full object-cover"
              />
              {item.isUser ? (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E94057] text-white text-lg leading-none">
                  +
                </span>
              ) : null}
            </div>
            <span className="text-xs font-medium text-[#1F1F33]">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
