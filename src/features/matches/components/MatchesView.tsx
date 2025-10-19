import { motion } from "framer-motion";
import { MatchCard } from "./MatchCard";
import { MatchSectionTitle } from "./MatchSectionTitle";

interface MatchItem {
  id: string;
  name: string;
  age: number;
  image: string;
  section: "today" | "yesterday" | "earlier";
}

interface MatchesViewProps {
  items: MatchItem[];
  onPass?: (id: string) => void;
  onLike?: (id: string) => void;
}

export const MatchesView = ({ items, onPass, onLike }: MatchesViewProps) => {
  const todayMatches = items.filter((item) => item.section === "today");
  const yesterdayMatches = items.filter((item) => item.section === "yesterday");
  const earlierMatches = items.filter((item) => item.section === "earlier");

  const renderSection = (label: string, data: MatchItem[]) => {
    if (data.length === 0) return null;

    return (
      <div>
        <MatchSectionTitle label={label} />
        <motion.div layout className="grid grid-cols-2 gap-4 pb-6">
          {data.map((item) => (
            <MatchCard key={item.id} {...item} onPass={onPass} onLike={onLike} />
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto w-full max-w-[420px] px-6 pb-28 pt-12">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#1F1F33] dark:text-white">Matches</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#8C8D9E] dark:text-gray-400">
              This is a list of people who have liked you and your matches.
            </p>
          </div>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#EEEFF5] text-[#E94057] shadow-[0_10px_24px_rgba(233,64,87,0.08)]"
            aria-label="Sort matches"
          >
            ?
          </button>
        </div>

        <div className="mt-8 space-y-8">
          {renderSection("Today", todayMatches)}
          {renderSection("Yesterday", yesterdayMatches)}
          {renderSection("Earlier", earlierMatches)}
        </div>
      </div>
    </div>
  );
};
