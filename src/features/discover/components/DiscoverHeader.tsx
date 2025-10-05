import { Button } from "@/components/ui/button";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

interface DiscoverHeaderProps {
  onBack?: () => void;
  onFilter?: () => void;
  locationLabel?: string;
}

export const DiscoverHeader = ({ onBack, onFilter, locationLabel = "Chicago, IL" }: DiscoverHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onBack}
        className="h-14 w-14 rounded-[20px] border-[#EEEFF5] bg-white text-[#E94057] shadow-[0_10px_24px_rgba(233,64,87,0.08)]"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="text-center">
        <p className="text-2xl font-semibold text-[#1F1F33]">Discover</p>
        <p className="text-sm text-[#8C8D9E]">{locationLabel}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onFilter}
        className="h-14 w-14 rounded-[20px] border-[#EEEFF5] bg-white text-[#E94057] shadow-[0_10px_24px_rgba(233,64,87,0.08)]"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
};
