"use client";

import { useLayoutEffect, useRef } from "react";
import type { ProfessionalProject } from "@/lib/content";

type ProfessionalWorkProps = { projects: ProfessionalProject[] };

export function ProfessionalWork({ projects }: ProfessionalWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const steps = stepsRef.current;
    if (!section || !list || !steps || projects.length < 2) return;

    const cards = Array.from(list.querySelectorAll<HTMLElement>(".professional-row"));
    const markers = Array.from(steps.children) as HTMLElement[];
    const mobile = window.matchMedia("(max-width: 680px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let anchorNavigation = false;

    const update = () => {
      frame = 0;
      if (mobile.matches || reducedMotion.matches) {
        section.classList.remove("rail-ready");
        section.style.removeProperty("height");
        cards.forEach((card) => {
          card.style.removeProperty("transform");
          card.style.removeProperty("opacity");
          card.style.removeProperty("z-index");
          card.style.removeProperty("pointer-events");
        });
        markers.forEach((marker) => marker.style.removeProperty("top"));
        return;
      }

      const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 82;
      const bottomSpace = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--rail-bottom-space")) || 28;
      const stepHeight = Math.max(1, window.innerHeight - headerHeight - bottomSpace * 2);
      // Keep the sticky frame clear of the section's bottom border after the
      // browser settles on the final snap stop. Reserve extra runway so snap
      // rounding cannot push the frame into the section boundary.
      section.style.height = `${cards.length * stepHeight + bottomSpace * 4}px`;
      section.classList.add("rail-ready");
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const start = sectionTop - headerHeight;
      const progress = Math.max(0, Math.min(cards.length - 1, (window.scrollY - start) / stepHeight));

      markers.forEach((marker, index) => { marker.style.top = `${index * stepHeight}px`; });
      cards.forEach((card, index) => {
        const offset = index - progress;
        const distance = Math.abs(offset);
        card.style.transform = `translate3d(${offset * 100}%, 0, 0) scale(${1 - Math.min(distance, 1) * 0.035})`;
        card.style.opacity = String(Math.max(0, 1 - distance * 1.25));
        card.style.zIndex = String(cards.length - Math.round(distance * 10));
        card.style.pointerEvents = distance < 0.48 ? "auto" : "none";
      });
    };

    const schedule = () => {
      if (!anchorNavigation && !frame) frame = window.requestAnimationFrame(update);
    };
    const onAnchorStart = () => { anchorNavigation = true; };
    const onAnchorEnd = () => { anchorNavigation = false; schedule(); };

    update();
    anchorNavigation = document.documentElement.classList.contains("anchor-navigating");
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    reducedMotion.addEventListener("change", schedule);
    window.addEventListener("portfolio:anchor-navigation-start", onAnchorStart);
    window.addEventListener("portfolio:anchor-navigation-end", onAnchorEnd);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
      reducedMotion.removeEventListener("change", schedule);
      window.removeEventListener("portfolio:anchor-navigation-start", onAnchorStart);
      window.removeEventListener("portfolio:anchor-navigation-end", onAnchorEnd);
    };
  }, [projects.length]);

  return (
    <section className="professional-section" id="professional-work" ref={sectionRef}>
      <div className="shell professional-inner">
        <aside className="professional-copy">
          <div className="professional-copy-inner" data-reveal>
            <p className="eyebrow"><span className="eyebrow-line" /> PROFESSIONAL WORK</p>
            <h2>Systems built<br /><span>with a team.</span></h2>
            <p className="section-intro">Selected experience described at a high level. Project names, customer details, internal configuration, and proprietary implementation specifics are intentionally left out.</p>
            <p className="privacy-note"><span aria-hidden="true">◈</span> Professional case studies are generalized to protect company and client confidentiality.</p>
          </div>
        </aside>
        <div className="professional-list" ref={listRef} role="group" aria-label="Professional projects">
          {projects.map((project, index) => (
            <article className="professional-row" key={project.number} aria-label={`${project.number}: ${project.title}`}>
              <span className="professional-number">{project.number}</span>
              <div className="professional-main">
                <div className="professional-title-line"><h3>{project.title}</h3><span>{project.status}</span></div>
                <p>{project.description}</p>
                <p className="contribution"><b>Contribution</b> {project.contribution}</p>
                <div className="tag-list subtle-tags">{project.technologies.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              {project.number === "04" ? <span className="in-progress-mark"><i/>IN PROGRESS</span> : <span className="row-arrow" aria-hidden="true">↗</span>}
            </article>
          ))}
        </div>
      </div>
      <div className="professional-steps" ref={stepsRef} aria-hidden="true">
        {projects.map((project) => <span className="professional-step" key={project.number} />)}
      </div>
    </section>
  );
}
