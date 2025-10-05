export interface MatchListing {
  id: string;
  name: string;
  age: number;
  image: string;
  section: "today" | "yesterday" | "earlier";
}

export const mockMatchesListing: MatchListing[] = [
  {
    id: "match-1",
    name: "Leilani",
    age: 19,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    section: "today",
  },
  {
    id: "match-2",
    name: "Annabelle",
    age: 20,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    section: "today",
  },
  {
    id: "match-3",
    name: "Reagan",
    age: 24,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    section: "today",
  },
  {
    id: "match-4",
    name: "Hadley",
    age: 25,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    section: "today",
  },
  {
    id: "match-5",
    name: "Chloe",
    age: 26,
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    section: "yesterday",
  },
  {
    id: "match-6",
    name: "Marcus",
    age: 28,
    image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=400&q=80",
    section: "yesterday",
  },
  {
    id: "match-7",
    name: "Sofia",
    age: 23,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    section: "earlier",
  },
  {
    id: "match-8",
    name: "Noah",
    age: 29,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    section: "earlier",
  },
];
