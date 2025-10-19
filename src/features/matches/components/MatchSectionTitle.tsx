interface MatchSectionTitleProps {
  label: string;
}

export const MatchSectionTitle = ({ label }: MatchSectionTitleProps) => {
  return (
    <div className="my-6 flex items-center justify-between">
      <span className="text-sm font-semibold uppercase tracking-[0.35em] text-[#C3C4D1]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#EBECF5]" />
    </div>
  );
};
