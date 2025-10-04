import hero1 from "@/assets/profile1.jpg";
import hero2 from "@/assets/profile2.jpg";
import hero3 from "@/assets/date1.jpg";

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  accent: {
    from: string;
    to: string;
  };
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "algorithm",
    title: "Algorithm",
    description: "Users going through a vetting process to ensure you never match with bots.",
    image: hero1,
    accent: {
      from: "#FDE2E7",
      to: "#F8A6B7",
    },
  },
  {
    id: "matches",
    title: "Matches",
    description: "We match you with people that have a large array of similar interests.",
    image: hero2,
    accent: {
      from: "#FFF2E1",
      to: "#F9C27B",
    },
  },
  {
    id: "premium",
    title: "Premium",
    description: "Sign up today and enjoy the first month of premium benefits on us.",
    image: hero3,
    accent: {
      from: "#E8E3FF",
      to: "#C2B5F2",
    },
  },
];
