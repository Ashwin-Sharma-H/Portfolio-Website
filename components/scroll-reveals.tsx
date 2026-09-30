"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveals() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("motion-ready");
      return;
    }

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }
    }, { threshold: 0.08, rootMargin: "-5% 0px -5% 0px" });

    targets.forEach((target) => observer.observe(target));
    document.documentElement.classList.add("motion-ready");

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
