"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    let context: ReturnType<typeof gsap.context> | undefined;
    const frame = window.requestAnimationFrame(() => {
      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-enter]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", clearProps: "transform" }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
          const items = Array.from(group.children).filter((child) =>
            child.hasAttribute("data-reveal-item")
          );
          if (items.length === 0) return;

          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: group,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      context?.revert();
    };
  }, [pathname]);

  return null;
}
