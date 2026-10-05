"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Hero video. Pauses when off-screen to keep page scroll smooth.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = 0;

    const play = () => {
      v.muted = true;
      void v.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
          play();
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.15, 0.5] }
    );
    io.observe(v);

    return () => io.disconnect();
  }, [reduceMotion]);

  const mediaClass =
    "absolute inset-0 h-full w-full object-cover object-[72%_42%] sm:object-[70%_40%] md:object-[65%_center] lg:object-center bg-[#0c0b0a]";

  if (reduceMotion) {
    return (
      <Image
        src="/images/hero-perfect.jpg"
        alt="Zaré luxury perfume"
        fill
        priority
        className={mediaClass}
        sizes="100vw"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={mediaClass}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Zaré luxury perfume"
      disablePictureInPicture
    >
      <source src="/videos/smoke.webm" type="video/webm" />
    </video>
  );
}
