import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { onboardingSlides } from "../data/slides";

const SWIPE_CONFIDENCE_THRESHOLD = 120;

const cardTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const OnboardingSlides = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const navigate = useNavigate();

  const { current, previous, next } = useMemo(() => {
    const current = onboardingSlides[index];
    const previous = onboardingSlides[(index + onboardingSlides.length - 1) % onboardingSlides.length];
    const next = onboardingSlides[(index + 1) % onboardingSlides.length];
    return { current, previous, next };
  }, [index]);

  const goTo = (nextIndex: number, swipeDirection: 1 | -1) => {
    setDirection(swipeDirection);
    setIndex((nextIndex + onboardingSlides.length) % onboardingSlides.length);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      goTo(index + 1, 1);
      return;
    }

    if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      goTo(index - 1, -1);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center bg-white">
      <div className="w-full max-w-[460px] flex-1 px-6 pb-10 pt-12 md:py-10">
        <div className="flex flex-col items-center">
          <div className="relative flex h-[420px] w-full items-center justify-center">
            <motion.div
              key={previous.id}
              initial={{ opacity: 0, x: direction === 1 ? -60 : -120, scale: 0.75 }}
              animate={{ opacity: 0.7, x: -120, scale: 0.82 }}
              transition={cardTransition}
              className="absolute left-1/2 top-1/2 z-0 h-[340px] w-[230px] -translate-x-[70%] -translate-y-1/2 overflow-hidden rounded-[32px] shadow-md"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${previous.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />

            <motion.div
              key={next.id}
              initial={{ opacity: 0, x: direction === -1 ? 60 : 120, scale: 0.75 }}
              animate={{ opacity: 0.7, x: 120, scale: 0.82 }}
              transition={cardTransition}
              className="absolute left-1/2 top-1/2 z-0 h-[340px] w-[230px] -translate-y-1/2 translate-x-[10%] overflow-hidden rounded-[32px] shadow-md"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${next.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={current.id}
                drag="x"
                dragElastic={0.2}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                custom={direction}
                initial={{ x: direction * 220, opacity: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: direction * -220, opacity: 0 }}
                transition={cardTransition}
                className="relative z-10 h-[380px] w-[280px] overflow-hidden rounded-[36px] bg-white shadow-[0_25px_45px_rgba(233,64,87,0.25)]"
                aria-live="polite"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(180deg, ${current.accent.from}, ${current.accent.to})`,
                  }}
                  aria-hidden="true"
                />
                <img
                  src={current.image}
                  alt={current.title}
                  className="relative z-[1] h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.h1
            key={`title-${current.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-12 text-center text-3xl font-semibold tracking-tight text-[#E94057]"
          >
            {current.title}
          </motion.h1>
          <motion.p
            key={`description-${current.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 px-2 text-center text-base text-[#2E2E4D]"
          >
            {current.description}
          </motion.p>

          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Onboarding slides">
            {onboardingSlides.map((slide, slideIndex) => {
              const isActive = slideIndex === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(slideIndex, slideIndex > index ? 1 : -1)}
                  aria-label={`Afficher la diapositive ${slideIndex + 1}`}
                  className="relative h-2 w-2 rounded-full"
                  role="tab"
                  aria-selected={isActive}
                >
                  <span
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      isActive ? "bg-[#E94057] shadow-[0_0_12px_rgba(233,64,87,0.35)] scale-125" : "bg-[#D9D9D9]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-8 w-full">
            <Button
              onClick={() => navigate("/onboarding/basics")}
              className="h-14 w-full rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)] transition-transform duration-200 hover:scale-[1.02] hover:bg-[#d4384f]"
            >
              Create an account
            </Button>

            <div className="mt-5 text-center text-sm text-[#555770]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/auth?tab=signin")}
                className="font-semibold text-[#E94057]"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

