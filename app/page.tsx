import { ContactForm } from "@/components/contact-form";
import { ProfessionalWork } from "@/components/professional-work";
import { ProjectShowcase } from "@/components/project-showcase";
import { certifications, certificationsUrl, github, linkedin, professionalProjects, projects } from "@/lib/content";
import { experience } from "@/lib/resume-content";

const capabilities = ["Generative AI", "RAG systems", "AI agents", "Machine learning", "Backend engineering", "Production AI"];

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <main id="main">
      <section className="hero-section shell" id="top">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow"><span className="eyebrow-line" /> AI / ML ENGINEER <span className="eyebrow-muted">· TRIVANDRUM, INDIA</span></p>
          <h1>I build AI systems<br /><span>that make it</span><br />into the real world.</h1>
          <p className="hero-lede">From Generative AI and retrieval systems to reliable backends and cloud-connected products, I turn complex ideas into useful software.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore selected work <span aria-hidden="true">↓</span></a>
            <a className="button button-quiet" href="/resume">View résumé <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-meta"><span><i className="status-dot" /> Building practical AI</span><span>GenAI · ML · Systems</span></div>
        </div>
        <div className="hero-visual" data-reveal="hero-visual" aria-label="Illustration of an AI system connecting product, model, data, and infrastructure layers">
          <div className="visual-topline"><span>AI SYSTEMS / 001</span><span>DESIGN → BUILD → SHIP</span></div>
          <div className="system-art">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <svg className="flow-routes" viewBox="0 0 600 360" aria-hidden="true" focusable="false">
              <path className="flow-route" d="M300 48 C258 91 263 126 300 180" />
              <path className="flow-route flow-route-2" d="M500 180 C431 148 377 151 300 180" />
              <path className="flow-route flow-route-3" d="M300 315 C343 271 337 225 300 180" />
              <path className="flow-route flow-route-4" d="M100 180 C169 148 223 153 300 180" />
              <path className="flow-route-pulse" d="M300 48 C258 91 263 126 300 180 M500 180 C431 148 377 151 300 180 M300 315 C343 271 337 225 300 180 M100 180 C169 148 223 153 300 180" />
            </svg>
            <div className="system-center"><span className="center-glyph">A<span>.</span></span><small>INTELLIGENCE<br />IN PRACTICE</small></div>
            <div className="node node-model"><span className="node-icon">✳</span><b>MODEL</b><small>LLM · ML · VISION</small></div>
            <div className="node node-data"><span className="node-icon">⌘</span><b>DATA</b><small>CONTEXT · SIGNAL</small></div>
            <div className="node node-product"><span className="node-icon">◫</span><b>PRODUCT</b><small>API · INTERFACE</small></div>
            <div className="node node-cloud"><span className="node-icon">⌁</span><b>RUNTIME</b><small>DEPLOY · OPERATE</small></div>
            <span className="art-cross cross-a">+</span><span className="art-cross cross-b">+</span><span className="art-cross cross-c">+</span>
          </div>
          <div className="visual-caption"><span>01 — SYSTEM THINKING</span><span>Human problem → engineered solution</span></div>
        </div>
      </section>

      <section className="capability-band" aria-label="Areas of focus">
        <div className="shell capability-inner"><span className="band-label">FOCUS AREAS</span>{capabilities.map((item) => <span className="capability" key={item}>{item}</span>)}</div>
      </section>

      <section className="work-intro-section shell" id="work">
        <div className="work-intro-copy" data-reveal>
          <p className="eyebrow"><span className="eyebrow-line" /> SELECTED WORK <span className="eyebrow-muted">· 0{projects.length} CASE FILES</span></p>
          <h2>Ideas made<br /><span>operational.</span></h2>
          <p className="section-intro">Product and research work across Generative AI, machine learning, and software engineering. Each case file opens into the problem, decisions, and system behind it.</p>
          <a className="button button-primary" href="#projects">Reveal selected projects <span aria-hidden="true">↓</span></a>
        </div>
        <div className="project-mosaic" aria-label="Project previews">
          {projects.map((project) => <div className={`mosaic-tile mosaic-${project.slug}`} key={project.slug} aria-label={project.title}>
            <div className="mosaic-topline"><span className="mosaic-index">{project.number} / {project.category.split(" · ")[0]}</span><span className="mosaic-live"><i /> PROJECT FILE</span></div>
            <div className="mosaic-art" aria-hidden="true">
              {project.slug === "aurafit" && <div className="mosaic-aura-scene">
                <div className="salad-topline"><span>FRESH / PERSONALIZED</span><b>01</b></div>
                <div className="salad-orbit"><i /></div>
                <svg className="salad-illustration" viewBox="0 0 300 230" role="img" aria-label="A fresh salad bowl with lettuce, tomatoes, cucumber, and onion">
                  <defs>
                    <linearGradient id="salad-bowl-glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d9eee2" stopOpacity=".3"/><stop offset=".48" stopColor="#8db5a2" stopOpacity=".12"/><stop offset="1" stopColor="#26383a" stopOpacity=".82"/></linearGradient>
                    <linearGradient id="salad-leaf-green" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c6e879"/><stop offset=".55" stopColor="#67a557"/><stop offset="1" stopColor="#315f48"/></linearGradient>
                    <radialGradient id="salad-tomato-red" cx=".3" cy=".25"><stop stopColor="#ffc38c"/><stop offset=".45" stopColor="#f0704d"/><stop offset="1" stopColor="#a93f3c"/></radialGradient>
                  </defs>
                  <ellipse cx="150" cy="199" rx="91" ry="12" fill="#000" opacity=".28"/>
                  <g className="salad-ingredients">
                    <path d="M60 93C52 66 77 47 103 72c4-28 35-36 52-7 10-29 43-24 45 7 26-24 53-6 38 22-28 24-145 29-178-1Z" fill="url(#salad-leaf-green)" stroke="#d5ef9a" strokeOpacity=".6" strokeWidth="2"/>
                    <path d="M81 89c9-13 15-20 23-24m4 26c13-15 24-23 38-28m10 30c9-13 22-20 37-26m5 29c11-10 21-16 32-19" fill="none" stroke="#315f48" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
                    <circle cx="91" cy="91" r="15" fill="url(#salad-tomato-red)" stroke="#ffd0a4" strokeWidth="2"/><path d="m87 76 4 5 5-5" fill="none" stroke="#67934e" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="198" cy="83" r="14" fill="url(#salad-tomato-red)" stroke="#ffd0a4" strokeWidth="2"/><path d="m194 69 4 5 5-5" fill="none" stroke="#67934e" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="139" cy="82" r="16" fill="#4f8962" stroke="#c6e99b" strokeWidth="5"/><circle cx="139" cy="82" r="3" fill="#d9e9a8"/>
                    <circle cx="172" cy="96" r="13" fill="#4f8962" stroke="#c6e99b" strokeWidth="4"/><circle cx="172" cy="96" r="2.5" fill="#d9e9a8"/>
                    <path d="M114 103c9-10 19-10 28 0s19 10 28 0" fill="none" stroke="#e5c4e4" strokeWidth="4" strokeLinecap="round"/>
                  </g>
                  <path d="M48 91 72 177q78 26 156 0l24-86" fill="url(#salad-bowl-glass)" stroke="#d5e8dc" strokeOpacity=".55" strokeWidth="2"/>
                  <ellipse cx="150" cy="90" rx="102" ry="34" fill="none" stroke="#e1eee5" strokeOpacity=".84" strokeWidth="3"/>
                  <ellipse cx="150" cy="91" rx="95" ry="27" fill="none" stroke="#b9ddc8" strokeOpacity=".3" strokeWidth="1.5"/>
                  <path d="m88 112 20 57" stroke="#f1fff4" strokeOpacity=".34" strokeWidth="4" strokeLinecap="round"/>
                </svg>
                <span className="salad-spark spark-one">✦</span><span className="salad-spark spark-two">✳</span>
                <div className="salad-ai-chip"><span>✳</span> GEMINI MEAL PLAN</div>
                <div className="salad-nutrition"><small>FRESHLY BALANCED</small><b>28g protein <i>·</i> 420 kcal</b></div>
              </div>}
              {project.slug === "astroledger" && <div className="mosaic-ledger-scene">
                <div className="ledger-window"><div className="ledger-window-head"><span><i/><i/><i/></span><small>ASTROLEDGER / OVERVIEW</small><b>LOCAL</b></div>
                  <div className="ledger-stats"><div><small>ACTIVE CLIENTS</small><b>128</b><span>+12 this month</span></div><div><small>RECORDS SECURED</small><b>2.4k</b><span>On this device</span></div></div>
                  <svg className="ledger-chart" viewBox="0 0 360 100" preserveAspectRatio="none"><path d="M0 82 C40 74 44 48 82 58 S130 76 164 45 220 61 252 28 310 47 360 12"/><path className="ledger-chart-fill" d="M0 82 C40 74 44 48 82 58 S130 76 164 45 220 61 252 28 310 47 360 12 V100 H0Z"/></svg>
                  <div className="ledger-chart-label"><span>RECORD ACTIVITY</span><span>LAST 30 DAYS</span></div>
                </div><div className="ledger-phone"><span/><i/><i/><i/><b>SYNCED</b></div>
              </div>}
              {project.slug === "vanet-greyhole-detection" && <div className="mosaic-network-scene">
                <svg viewBox="0 0 440 260" preserveAspectRatio="xMidYMid meet">
                  <g className="network-links"><path d="M32 185 105 90 172 142 236 55 304 115 393 72M32 185 120 218 172 142 260 210 304 115 362 196M105 90 236 55 304 115 393 72M172 142 304 115 393 170"/></g>
                  <g className="network-nodes"><circle cx="32" cy="185" r="7"/><circle cx="105" cy="90" r="7"/><circle cx="120" cy="218" r="7"/><circle className="node-alert" cx="172" cy="142" r="9"/><circle cx="236" cy="55" r="7"/><circle cx="260" cy="210" r="7"/><circle cx="304" cy="115" r="7"/><circle cx="393" cy="72" r="7"/><circle cx="362" cy="196" r="7"/></g>
                </svg><span className="network-signal"><i/> ANOMALY DETECTED <b>0.94</b></span>
              </div>}
            </div>
            <span className="mosaic-title">{project.title}</span>
          </div>)}
        </div>
      </section>

      <ProjectShowcase projects={projects} />

      <ProfessionalWork projects={professionalProjects} />

      <section className="section shell experience-section" id="experience">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow"><span className="eyebrow-line" /> EXPERIENCE</p><h2>Learning by<br /><span>shipping.</span></h2></div>
          <p className="section-intro">AI/ML, data, and backend engineering across Generative AI, retrieval, application architecture, and reliable systems.</p>
        </div>
        <div className="experience-layout">
          <div className="experience-timeline">
            {experience.map((role, index) => <article className={`experience-item${index === 0 ? " current-role" : ""}`} data-reveal={index % 2 === 0 ? "left" : "right"} data-reveal-delay={index || undefined} key={role.title}>
              <span className="timeline-dot"/><div className="experience-date">{role.date}</div><div className="experience-title"><h3>{role.title}</h3><span>{role.type}</span></div><p className="experience-company">{role.company}{role.location ? ` · ${role.location}` : ""}</p><p>{role.description}</p>
            </article>)}
          </div>
          <aside className="toolkit-panel" id="about" data-reveal>
            <p className="eyebrow">HOW I WORK</p><h3>Bridge the model<br />and the product.</h3><p className="toolkit-copy">My work connects AI capability to the engineering underneath it: data flow, APIs, user experience, deployment, and iteration.</p>
            <div className="toolkit-groups"><div><span>AI / ML</span><p>Generative AI · RAG · NLP · Computer vision · Model evaluation</p></div><div><span>ENGINEERING</span><p>Python · Django · FastAPI · React · TypeScript · SQL</p></div><div><span>PLATFORM</span><p>Cloud deployment · API integration · PostgreSQL · PWA</p></div></div>
          </aside>
        </div>
      </section>

      <section className="cert-section" id="certifications" data-reveal>
        <div className="shell cert-inner">
          <div><p className="eyebrow"><span className="eyebrow-line" /> CONTINUOUS LEARNING</p><h2>Certifications<span>.</span></h2><p className="cert-caption">Listed on LinkedIn · credential IDs omitted</p><a className="cert-link" href={certificationsUrl} target="_blank" rel="noreferrer">View certifications on LinkedIn ↗</a></div>
          <ul className="cert-list">{certifications.map((cert, index) => <li data-reveal={index % 2 === 0 ? "left" : "right"} data-reveal-delay={(index % 4) + 1} key={cert.name}><a className="cert-entry" href={certificationsUrl} target="_blank" rel="noreferrer" aria-label={`${cert.name} on LinkedIn`}><span className="cert-icon" aria-hidden="true">✳</span><div><h3>{cert.name}</h3><p>{cert.issuer} · Issued {cert.issued}{cert.expires ? ` · Expires ${cert.expires}` : ""}</p></div></a></li>)}</ul>
        </div>
      </section>

      <section className="contact-section shell" id="contact" data-reveal>
        <div className="contact-heading"><p className="eyebrow"><span className="eyebrow-line" /> START A CONVERSATION</p><h2>Have a problem<br /><span>worth solving?</span></h2><p>For AI engineering, product work, or a thoughtful technical conversation, send me a note.</p><div className="contact-socials"><a href={linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn ↗</a><a href={github} target="_blank" rel="noreferrer">Explore GitHub ↗</a></div></div>
        <div className="contact-card"><div className="contact-card-heading"><span>CONTACT FORM</span><span>PRIVATE · SERVER HANDLED</span></div><ContactForm /></div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projects.map((project) => ({ "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.summary, url: `${siteUrl}/work/${project.slug}`, author: { "@type": "Person", name: "Ashwin Sharma" } }))) }} />
    </main>
  );
}
