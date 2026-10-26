"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
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
          card.classList.remove("is-current");
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
        card.classList.toggle("is-current", distance < 0.48);
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
            <Link className="professional-row" key={project.number} href={`/work/${project.slug}`} aria-label={`Open case study: ${project.title}`}>
              <div className={`professional-art professional-art-${project.number}`} aria-hidden="true">
                {project.number === "01" && <div className="publishing-visual">
                  <div className="pub-window"><div className="pub-window-bar"><span/><span/><span/><b>STUDIO / CONTENT</b></div><div className="pub-page"><small>NEW STORY</small><b>Ideas into<br/>something real.</b><i className="pub-image"/><span/><span/><span/></div><div className="pub-outputs"><i>TXT</i><i>IMG</i><i>PDF</i><b>READY TO PUBLISH ↗</b></div></div>
                  <span className="pub-orbit pub-orbit-a"/><span className="pub-orbit pub-orbit-b"/><span className="pub-spark">✳</span>
                </div>}
                {project.number === "02" && <div className="updates-visual">
                  <div className="update-report"><div className="update-head"><span>WEEKLY SUMMARY</span><b>W 24</b></div><div className="update-metric"><b>86%</b><span>TEAM PROGRESS</span><i/></div><svg viewBox="0 0 320 110" preserveAspectRatio="none"><path d="M5 87 C34 78 36 57 70 61 S114 79 145 49 192 62 217 35 267 49 315 14"/></svg><div className="update-days"><i/><i/><i/><i/><i/><i/><i/></div></div>
                  <div className="update-note"><small>TEAM UPDATE</small><b>Milestone<br/>completed</b><span>2h ago</span><i>✓</i></div><span className="update-pulse"/>
                </div>}
                {project.number === "03" && <div className="learning-visual">
                  <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid meet"><path className="learning-path" d="M38 192 104 143 167 165 225 92 319 47M104 143 114 62 225 92 278 190 319 47"/><circle cx="38" cy="192" r="8"/><circle cx="104" cy="143" r="8"/><circle cx="114" cy="62" r="8"/><circle className="learning-active" cx="167" cy="165" r="10"/><circle cx="225" cy="92" r="8"/><circle cx="278" cy="190" r="8"/><circle cx="319" cy="47" r="8"/></svg>
                  <div className="learning-module module-one"><small>01 / FOUNDATION</small><b>Core concepts</b></div><div className="learning-module module-two"><small>02 / PRACTICE</small><b>Guided learning</b></div><span className="learning-badge">REUSABLE PATH <i>↗</i></span>
                </div>}
                {project.number === "04" && <div className="exercise-visual">
                  <div className="exercise-device"><div className="exercise-device-head"><span>POSE ANALYSIS</span><b>LIVE</b></div><svg viewBox="0 0 220 260"><path className="skeleton-bones" d="M110 47 110 103 72 132 51 187M110 103 148 132 169 187M110 103 82 163 76 222M110 103 138 163 144 222"/><circle cx="110" cy="30" r="15"/><circle cx="110" cy="47" r="5"/><circle className="pose-joint" cx="110" cy="103" r="6"/><circle cx="72" cy="132" r="5"/><circle cx="148" cy="132" r="5"/><circle cx="51" cy="187" r="5"/><circle cx="169" cy="187" r="5"/><circle cx="82" cy="163" r="5"/><circle cx="138" cy="163" r="5"/><circle cx="76" cy="222" r="5"/><circle cx="144" cy="222" r="5"/></svg><div className="exercise-score"><span>FORM SCORE</span><b>92</b><i><em/></i></div></div>
                  <span className="exercise-scan"/><span className="exercise-target target-one"/><span className="exercise-target target-two"/>
                </div>}
              </div>
              <span className="professional-number">{project.number}</span>
              <div className="professional-main">
                <div className="professional-title-line"><h3>{project.title}</h3><span>{project.status}</span></div>
                <p>{project.description}</p>
                <p className="contribution"><b>Contribution</b> {project.contribution}</p>
                <div className="tag-list subtle-tags">{project.technologies.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </div>
              {project.number === "04" ? <span className="in-progress-mark"><i/>IN PROGRESS</span> : <span className="row-arrow" aria-hidden="true">↗</span>}
            </Link>
          ))}
        </div>
      </div>
      <div className="professional-steps" ref={stepsRef} aria-hidden="true">
        {projects.map((project) => <span className="professional-step" key={project.number} />)}
      </div>
    </section>
  );
}
