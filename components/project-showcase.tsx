"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import type { Project } from "@/lib/content";

type ProjectShowcaseProps = { projects: Project[] };

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const markersRoot = markersRef.current;
    if (!section || !stage || !markersRoot || projects.length < 2) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>(".project-card"));
    const panels = cards.map((card) => ({
      card,
      visual: card.querySelector<HTMLElement>(".project-visual"),
      content: card.querySelector<HTMLElement>(".project-content"),
      near: null as boolean | null,
      visible: null as boolean | null,
      active: null as boolean | null,
      stack: null as number | null,
    }));
    const markers = Array.from(markersRoot.children) as HTMLElement[];
    const mobile = window.matchMedia("(max-width: 680px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let scrollIdleTimer = 0;
    let anchorNavigation = false;
    let scrollSettled = true;
    let step = 1;
    let start = 0;
    let railEnabled = false;

    // Geometry is read only during setup/resize. Reading it after changing the
    // section height on every scroll forced synchronous layout and caused jank.
    const measure = () => {
      if (mobile.matches || reducedMotion.matches) {
        railEnabled = false;
        section.classList.remove("rail-ready");
        section.style.removeProperty("height");
        markers.forEach((marker) => marker.style.removeProperty("top"));
        resetCards();
        return false;
      }

      const rootStyles = getComputedStyle(document.documentElement);
      const headerHeight = Number.parseFloat(rootStyles.getPropertyValue("--header-height")) || 82;
      const inset = Number.parseFloat(rootStyles.getPropertyValue("--rail-bottom-space")) || 28;
      step = Math.max(1, window.innerHeight - headerHeight - inset * 2);
      section.classList.add("rail-ready");
      section.style.height = `${cards.length * step + inset * 2}px`;
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      start = sectionTop - headerHeight;
      markers.forEach((marker, index) => { marker.style.top = `${index * step}px`; });
      railEnabled = true;
      return true;
    };

    const resetCards = () => panels.forEach((panel) => {
      const { card, visual, content } = panel;
      card.style.removeProperty("z-index");
      card.style.removeProperty("pointer-events");
      [visual, content].forEach((piece) => {
        if (!piece) return;
        piece.style.removeProperty("transform");
        piece.style.removeProperty("opacity");
      });
      card.classList.remove("is-visible");
      card.removeAttribute("aria-hidden");
      card.removeAttribute("inert");
      card.removeAttribute("data-project-active");
      card.classList.remove("is-near");
      panel.active = null;
      panel.near = null;
      panel.visible = null;
      panel.stack = null;
    });

    const update = () => {
      frame = 0;
      if (!railEnabled && !measure()) return;
      const rawProgress = Math.max(0, Math.min(cards.length - 1, (window.scrollY - start) / step));
      const nearestStop = Math.round(rawProgress);
      // Browser snap can finish a few pixels shy of the marker. Quantize only
      // after scrolling settles so the two panels meet cleanly at each stop.
      const progress = scrollSettled && Math.abs(rawProgress - nearestStop) < 0.18
        ? nearestStop
        : rawProgress;

      panels.forEach(({ card, visual, content }, index) => {
        const offset = index - progress;
        const distance = Math.abs(offset);
        const near = distance < 1.25;
        const visible = distance < 1.15;
        const active = distance < 0.5;
        const panel = panels[index];
        const wasNear = panel.near;

        if (wasNear !== near) {
          panel.near = near;
          card.classList.toggle("is-near", near);
        }

        // The two halves travel in opposite directions. The next card's
        // illustration comes from the right while its copy comes from the left.
        if (near && visual) {
          visual.style.transform = `translate3d(${offset * 100}%, 0, 0)`;
          visual.style.opacity = String(Math.max(0, 1 - distance));
        } else if (!near && wasNear !== false && visual) {
          visual.style.opacity = "0";
        }
        if (near && content) {
          content.style.transform = `translate3d(${-offset * 100}%, 0, 0)`;
          content.style.opacity = String(Math.max(0, 1 - distance));
        } else if (!near && wasNear !== false && content) {
          content.style.opacity = "0";
        }
        // Avoid repeated DOM state changes while the scroll position moves
        // within the same project interval.
        if (panel.active !== active) {
          panel.active = active;
          card.style.pointerEvents = active ? "auto" : "none";
          card.classList.toggle("is-visible", active);
          card.toggleAttribute("data-project-active", active);
        }
        if (panel.visible !== visible) {
          panel.visible = visible;
          card.setAttribute("aria-hidden", String(!visible));
          card.toggleAttribute("inert", !visible);
        }
        const stack = active ? 3 : offset > 0 ? 2 : 1;
        if (panel.stack !== stack) {
          panel.stack = stack;
          card.style.zIndex = String(stack);
        }
      });
    };

    const schedule = () => {
      if (anchorNavigation) return;
      section.classList.add("is-scrolling");
      scrollSettled = false;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        section.classList.remove("is-scrolling");
        scrollSettled = true;
        if (!frame) frame = window.requestAnimationFrame(update);
      }, 180);
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onAnchorStart = () => { anchorNavigation = true; };
    const onAnchorEnd = () => { anchorNavigation = false; schedule(); };

    measure();
    update();
    anchorNavigation = document.documentElement.classList.contains("anchor-navigating");
    window.addEventListener("scroll", schedule, { passive: true });
    const onResize = () => { if (!anchorNavigation) { measure(); schedule(); } };
    window.addEventListener("resize", onResize, { passive: true });
    mobile.addEventListener("change", schedule);
    reducedMotion.addEventListener("change", schedule);
    window.addEventListener("portfolio:anchor-navigation-start", onAnchorStart);
    window.addEventListener("portfolio:anchor-navigation-end", onAnchorEnd);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(scrollIdleTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      mobile.removeEventListener("change", schedule);
      reducedMotion.removeEventListener("change", schedule);
      window.removeEventListener("portfolio:anchor-navigation-start", onAnchorStart);
      window.removeEventListener("portfolio:anchor-navigation-end", onAnchorEnd);
      section.classList.remove("rail-ready");
      section.classList.remove("is-scrolling");
      section.style.removeProperty("height");
      resetCards();
    };
  }, [projects.length]);

  return (
    <section className="project-sequence" id="projects" aria-label="Selected projects" ref={sectionRef}>
      <div className="project-grid project-stage" ref={stageRef}>
        {projects.map((project) => (
          <article className={`project-card project-${project.slug}`} key={project.slug} aria-label={`${project.number}: ${project.title}`}>
            <div className="project-visual" aria-hidden="true">
              {project.slug === "aurafit" ? <div className="pantry-visual"><div className="meal-flow"><div className="meal-input"><span>INPUT</span><b>Pantry<br />+ goals</b></div><span className="meal-connector" aria-hidden="true">→</span><div className="meal-engine"><span>AI ASSIST</span><b>Gemini</b><i>Nutrition-aware</i></div><span className="meal-connector" aria-hidden="true">→</span><div className="meal-output"><span>OUTPUT</span><b>Meal<br />plan</b></div></div><span className="floating-chip">✳ context → useful plan</span></div> : null}
              {project.slug === "astroledger" ? <div className="offline-visual"><div className="device desktop-device"><span className="device-head"/><span className="device-line"/><span className="device-line small"/><span className="device-chart"/></div><div className="sync-path"><i/><i/><i/></div><div className="device phone-device"><span className="phone-notch"/><span className="device-line"/><span className="device-line small"/><span className="device-line"/></div><span className="local-tag">LOCAL · PRIVATE</span></div> : null}
              {project.slug === "vanet-greyhole-detection" ? <div className="network-visual"><div className="network-grid"/><svg viewBox="0 0 500 210" role="presentation"><path d="M43 157 126 75l82 54 88-79 72 70 89-54M43 157l97 27 68-55 89 62 71-71 89 37M126 75l14 109m68-55 88-79m-88 79 89 62m71-71 18 108"/><circle cx="43" cy="157" r="7"/><circle cx="126" cy="75" r="7"/><circle cx="208" cy="129" r="7"/><circle cx="296" cy="50" r="7"/><circle cx="368" cy="120" r="7"/><circle cx="457" cy="66" r="7"/><circle cx="140" cy="184" r="7"/><circle cx="279" cy="191" r="7"/><circle cx="386" cy="228" r="7"/></svg><div className="signal-tag">ANOMALY SIGNAL <span>REVIEW</span></div></div> : null}
              <span className="visual-index">{project.number} / CASE STUDY</span>
            </div>
            <div className="project-content">
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-summary">{project.summary}</p>
              <div className="tag-list">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="project-links"><Link href={`/work/${project.slug}`}>Read case study <span aria-hidden="true">↗</span></Link>{project.live ? <a href={project.live} target="_blank" rel="noreferrer">Live demo <span aria-hidden="true">↗</span></a> : null}</div>
            </div>
          </article>
        ))}
      </div>
      <div className="project-steps" ref={markersRef} aria-hidden="true">
        {projects.map((project) => <span className="project-step" key={project.slug} />)}
      </div>
    </section>
  );
}
