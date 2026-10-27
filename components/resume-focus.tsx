"use client";

import { useState } from "react";
import { resumeFocuses, type ResumeFocus } from "@/lib/resume-content";

export function ResumeFocusView() {
  const [focus, setFocus] = useState<ResumeFocus>("ai");
  const selected = resumeFocuses[focus];

  return (
    <div className="resume-focus-view">
      <section className="resume-focus-panel" aria-labelledby="resume-focus-title">
        <div className="resume-focus-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> CHOOSE A JOB FOCUS</p>
            <h2 id="resume-focus-title">Put the relevant work<br /><span>in the foreground.</span></h2>
            <p className="resume-intro">Select AI / GenAI or Data / Backend to explore the parts of my experience most relevant to each.</p>
          </div>
          <div className="resume-focus-controls" role="group" aria-label="Résumé focus">
            {(Object.keys(resumeFocuses) as ResumeFocus[]).map((key) => (
              <button key={key} type="button" aria-pressed={focus === key} onClick={() => setFocus(key)}>
                {resumeFocuses[key].label} roles
              </button>
            ))}
          </div>
        </div>

        <div className="resume-focus-content" key={focus} aria-live="polite" aria-atomic="false">
          <p className="resume-active-focus">{selected.intro}</p>
          <div className="resume-priority">
            <div className="resume-section-label"><span>01</span><div><b>PRIORITY SKILLS</b><small>Most relevant to this focus</small></div></div>
            <div className="resume-priority-list">{selected.prioritySkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </div>

          <section className="resume-subsection">
            <div className="resume-section-label"><span>02</span><div><b>SKILLS</b><small>{selected.title}</small></div></div>
            <div className="resume-skill-groups">
              {selected.skillGroups.map((group) => <div className="resume-skill-group" key={group.label}>
                <h3>{group.label}</h3><div>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </div>)}
            </div>
          </section>

          <section className="resume-subsection">
            <div className="resume-section-label"><span>03</span><div><b>RELEVANT EVIDENCE</b><small>Selected projects and contributions</small></div></div>
            <div className="resume-evidence-list">
              {selected.evidence.map((item) => <article className="resume-evidence-card" key={item.title}>
                <span className="resume-evidence-number">{item.number}</span>
                <div className="resume-evidence-body">
                  <h3>{item.title}</h3><p className="resume-evidence-summary">{item.summary}</p>
                  <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  <div className="resume-evidence-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>)}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
