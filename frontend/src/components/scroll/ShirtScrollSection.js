import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import stages from "./shirtScrollStages";
import { useOnScreen } from "../../lib/useOnScreen";

const ShirtScrollCanvas = dynamic(() => import("./ShirtScrollCanvas"), {
  ssr: false,
});

// A stage is active from the midpoint before it to the midpoint after it.
function activeStageIndex(p) {
  let idx = 0;
  for (let i = 1; i < stages.length; i++) {
    const boundary = (stages[i - 1].progress + stages[i].progress) / 2;
    if (p >= boundary) idx = i;
  }
  return idx;
}

/**
 * Pinned scroll story: the shirt canvas stays fixed for 3 viewport-heights
 * of scrolling while the camera travels through the stages defined in
 * shirtScrollStages.js, each synced to a fading text panel.
 */
export default function ShirtScrollSection({ modelUrl, modelScale = 1 }) {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [canvasRef, canvasVisible] = useOnScreen();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.5,
      onUpdate(self) {
        progressRef.current = self.progress;
        const idx = activeStageIndex(self.progress);
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });
    return () => st.kill();
  }, []);

  const stage = stages[active];

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-base">
      {/* Canvas fills the pinned viewport */}
      <div ref={canvasRef} className="absolute inset-0">
        <ShirtScrollCanvas
          progressRef={progressRef}
          stages={stages}
          modelUrl={modelUrl}
          modelScale={modelScale}
          frameloop={canvasVisible ? "always" : "never"}
        />
      </div>

      {/* Text panel — bottom-left, swaps per stage */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-bright">
                {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
              </span>
              <h2 className="headline mt-3 text-4xl md:text-5xl">{stage.title}</h2>
              <p className="mt-4 text-muted">{stage.body}</p>
            </motion.div>
          </AnimatePresence>

          {/* Stage progress ticks */}
          <div className="mt-8 flex gap-2">
            {stages.map((s, i) => (
              <span
                key={i}
                className={`h-0.5 w-10 transition-colors duration-300 ${
                  i <= active ? "bg-accent" : "bg-hairline"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
