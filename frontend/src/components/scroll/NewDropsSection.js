import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const FALLBACK_IMAGE = "/ichigo black tee.png";

function DropCard({ product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group w-[78vw] flex-shrink-0 snap-center sm:w-[56vw] md:w-[36vw] lg:w-[28vw]"
    >
      <div className="relative overflow-hidden border border-hairline bg-surface">
        <img
          src={product.imageUrl || product.image || FALLBACK_IMAGE}
          alt={product.name}
          className="h-[48vh] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] md:h-[54vh]"
        />
        <span className="absolute left-4 top-4 bg-accent-tint px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-bright">
          New
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold leading-snug">{product.name}</h3>
        <p className="whitespace-nowrap text-muted">₹{product.price}</p>
      </div>
    </Link>
  );
}

/**
 * "New drops": on md+ the section pins and vertical scroll translates the
 * card row horizontally (GSAP ScrollTrigger, scrubbed). Below md it's a
 * native scroll-snap row — no pinning on touch. A accent progress bar
 * tracks position in both modes.
 */
export default function NewDropsSection({ products = [], title = "New drops" }) {
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current;
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [products.length]);

  // Mobile: the row scrolls natively — mirror its position onto the bar.
  const handleNativeScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 0 && barRef.current) {
      barRef.current.style.transform = `scaleX(${el.scrollLeft / max})`;
    }
  };

  return (
    <section ref={sectionRef} className="bg-base py-16 md:h-screen md:py-0">
      <div className="flex h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <h2 className="headline text-5xl md:text-7xl">{title}</h2>
        </div>

        <div
          ref={scrollerRef}
          onScroll={handleNativeScroll}
          className="mt-10 snap-x snap-mandatory overflow-x-auto md:snap-none md:overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex w-max gap-6 px-6 md:gap-10 md:px-12 md:will-change-transform"
          >
            {products.map((p) => (
              <DropCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-10 w-full max-w-7xl px-6 md:px-12">
          <div className="h-0.5 w-full bg-hairline">
            <div
              ref={barRef}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
