import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";
import Magnetic from "../motion/Magnetic";
import { useOnScreen } from "../../lib/useOnScreen";

// three.js must never run on the server — client-only import.
const ShirtStage = dynamic(() => import("./ShirtStage"), { ssr: false });

/**
 * Hero section: display headline on the left, draggable 3D tee on the right.
 * Pass modelUrl (e.g. "/models/shirt.glb") once a real model exists;
 * without it a placeholder mesh renders.
 */
export default function HeroShirt({ modelUrl, modelScale = 1 }) {
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const [canvasRef, canvasVisible] = useOnScreen();

  return (
    <section className="bg-base border-b border-hairline">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="max-w-xl">
          <span className="inline-block bg-accent-tint px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-bright">
            New drop
          </span>
          <h1 className="headline mt-6 text-6xl md:text-8xl">
            Terrifying
            <br />
            Tees
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Heavyweight cotton. Oversized fits. Prints that stare back.
          </p>
          <Magnetic className="mt-10">
            <Link
              href="/products"
              className="inline-block bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Shop the drop
            </Link>
          </Magnetic>
        </div>

        <div
          ref={canvasRef}
          className="relative aspect-square w-full cursor-grab active:cursor-grabbing"
        >
          {/* Skeleton — sits on top and fades out once the scene is ready */}
          <div
            aria-hidden
            className={`absolute inset-0 animate-pulse rounded-lg bg-surface transition-opacity duration-700 ${
              ready ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <ShirtStage
              modelUrl={modelUrl}
              modelScale={modelScale}
              onReady={handleReady}
              frameloop={canvasVisible ? "always" : "never"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
