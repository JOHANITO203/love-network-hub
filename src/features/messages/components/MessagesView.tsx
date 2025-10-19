import { MessagesHeader } from "./MessagesHeader";
import { ActivityStories } from "./ActivityStories";
import { MessageList } from "./MessageList";
import { mockStories, mockMessages, type MessageListItem, type StoryItem } from "../data";

interface MessagesViewProps {
  stories?: StoryItem[];
  messages?: MessageListItem[];
  onSelectConversation?: (id: string) => void;
  onFilter?: () => void;
}

export const MessagesView = ({
  stories = mockStories,
  messages = mockMessages,
  onSelectConversation,
  onFilter,
}: MessagesViewProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto w-full max-w-[420px] px-6 pb-24 pt-12">
        <MessagesHeader onFilter={onFilter} />
        <ActivityStories items={stories} />
        <div className="mt-8">
          <h2 className="text-base font-semibold text-[#1F1F33] dark:text-white">Messages</h2>
          <MessageList items={messages} onSelect={onSelectConversation} />
        </div>
      </div>
    </div>
  );
};
