import { ArrowLeft, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

interface ConversationMessage {
  id: string;
  sender: "me" | "them";
  content: string;
  time: string;
}

interface ConversationViewProps {
  matchName: string;
  matchAvatar: string;
  statusLabel?: string;
  messages: ConversationMessage[];
  onBack: () => void;
}

export const ConversationView = ({
  matchName,
  matchAvatar,
  statusLabel = "Online",
  messages,
  onBack,
}: ConversationViewProps) => {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[#F9F9FB]">
      <div className="flex w-full max-w-[420px] flex-1 flex-col px-6 pb-10 pt-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#EEEFF5] bg-white text-[#E94057] shadow-[0_10px_24px_rgba(233,64,87,0.08)]"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-semibold text-[#1F1F33]">Messages</h1>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#EEEFF5] bg-white text-[#8C8D9E] shadow-[0_10px_24px_rgba(233,64,87,0.08)]"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="relative rounded-[36px] bg-white px-6 pb-6 pt-8 shadow-[0_35px_60px_rgba(17,17,17,0.08)]">
            <div className="flex items-center gap-4">
              <img src={matchAvatar} alt={matchName} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="text-lg font-semibold text-[#1F1F33]">{matchName}</p>
                <span className="text-sm text-[#E94057]">? {statusLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex-1 space-y-6">
          <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#C3C4D1]">
            <span className="flex-1 h-px bg-[#EBECF5]" />
            Today
            <span className="flex-1 h-px bg-[#EBECF5]" />
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-[20px] px-6 py-4 text-base leading-relaxed shadow-[0_18px_32px_rgba(17,17,17,0.08)] ${
                    message.sender === "me" ? "bg-[#F4F5F9] text-[#1F1F33]" : "bg-[#FFE8EE] text-[#1F1F33]"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className={`mt-2 block text-xs ${message.sender === "me" ? "text-[#8C8D9E]" : "text-[#E94057]"}`}>
                    {message.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex w-full items-center gap-3 rounded-[24px] border border-[#EEEFF5] bg-white px-4 py-3 shadow-[0_18px_40px_rgba(17,17,17,0.05)]">
          <input
            type="text"
            placeholder="Your message"
            className="flex-1 border-0 text-base text-[#1F1F33] placeholder:text-[#C7C8D5] focus:outline-none"
          />
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#F4F5F9] text-[#E94057]"
            aria-label="Send image"
          >
            ?
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#E94057] text-white shadow-[0_10px_24px_rgba(233,64,87,0.25)]"
            aria-label="Record message"
          >
            ??
          </button>
        </div>
      </div>
    </div>
  );
};
