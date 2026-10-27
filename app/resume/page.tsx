import type { Metadata } from "next";
import Link from "next/link";
import { ResumeFocusView } from "@/components/resume-focus";
import { ResumeTurbine } from "@/components/resume-turbine";
import { experience } from "@/lib/resume-content";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Explore Ashwin Sharma’s experience, skills, and project contributions, with optional AI/GenAI and Data/Backend focus views.",
  alternates: { canonical: "/resume" }
};

export default function ResumePage() {
  return (
    <main id="main" className="resume-page">
      <section className="resume-hero shell">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> EXPERIENCE · SKILLS · SELECTED CONTRIBUTIONS</p>
          <h1>A résumé with<br /><span>room to focus.</span></h1>
          <p>A single career story with focused views of the skills and project contributions most relevant to AI/GenAI and Data/Backend roles.</p>
          <div className="resume-hero-actions">
            <a className="button button-primary" href="/resume/Ashwin_Sharma_Resume.pdf" target="_blank" rel="noreferrer">Download current résumé (PDF) <span aria-hidden="true">↗</span></a>
            <Link className="button button-quiet" href="/">Back to main page <span aria-hidden="true">←</span></Link>
          </div>
        </div>
        <ResumeTurbine />
      </section>

      <ResumeFocusView />

      <section className="resume-career shell" aria-labelledby="resume-career-title">
        <div className="resume-career-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> CAREER HISTORY</p><h2 id="resume-career-title">Experience, in order.</h2></div><p>Full timeline shown consistently across either focus.</p></div>
        <div className="resume-career-list">
          {experience.map((role) => <article className="resume-career-item" key={role.title}>
            <div className="resume-career-date">{role.date}</div>
            <div><div className="resume-career-title"><h3>{role.title}</h3><span>{role.type}</span></div><p className="resume-career-company">{role.company}{role.location ? ` · ${role.location}` : ""}</p><p className="resume-career-description">{role.description}</p></div>
          </article>)}
        </div>
      </section>
    </main>
  );
}
