import { motion } from "framer-motion";

interface StoryFooterProps {
  onSendMessage?: (value: string) => void;
}

export const StoryFooter = ({ onSendMessage }: StoryFooterProps) => {
  return (
    <div className="absolute inset-x-0 bottom-0 px-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 rounded-[26px] border border-white/40 bg-white/20 px-5 py-4 backdrop-blur-md"
      >
        <input
          type="text"
          placeholder="Your message"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSendMessage?.((event.target as HTMLInputElement).value);
            }
          }}
          className="flex-1 border-0 bg-transparent text-base text-white placeholder:text-white/70 focus:outline-none"
        />
        <button type="button" className="text-white/80" aria-label="React">
          ?
        </button>
        <button type="button" className="text-white" aria-label="Send message">
          ?
        </button>
      </motion.div>
    </div>
  );
};
