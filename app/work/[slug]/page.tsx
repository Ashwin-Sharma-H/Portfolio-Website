import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnchorJumpLink } from "@/components/anchor-jump-link";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary, openGraph: { title: `${project.title} — Ashwin Sharma`, description: project.summary, type: "article" } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const projectJsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.summary, author: { "@type": "Person", name: "Ashwin Sharma" }, keywords: project.stack.join(", ") };

  return (
    <main id="main" className="case-page shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><AnchorJumpLink href="/#work">Selected work</AnchorJumpLink><span>/</span><span aria-current="page">{project.title}</span></nav>
      <header className="case-hero" data-reveal>
        <p className="eyebrow"><span className="eyebrow-line" /> CASE STUDY {project.number}</p>
        <h1>{project.title}<span>.</span></h1>
        <p className="case-lede">{project.summary}</p>
        <div className="case-meta"><div><span>AREA</span><b>{project.category}</b></div><div><span>ROLE</span><b>{project.role}</b></div><div><span>STATUS</span><b>{project.status}</b></div></div>
      </header>
      <section className="case-overview" data-snap><div className="case-label" data-reveal="left">01 / THE CHALLENGE</div><div data-reveal="right"><h2>Problem space</h2><p>{project.problem}</p></div></section>
      <section className="case-overview" data-snap><div className="case-label" data-reveal="left">02 / THE APPROACH</div><div data-reveal="right"><h2>What I built</h2><ul className="approach-list">{project.approach.map((item, index) => <li data-reveal={index % 2 === 0 ? "left" : "right"} data-reveal-delay={(index % 4) + 1} key={item}>{item}</li>)}</ul></div></section>
      <section className="case-architecture" data-snap><div className="case-label" data-reveal="left">03 / SYSTEM VIEW</div><div className="architecture-panel" data-reveal="right"><div className="architecture-title"><div><span>ARCHITECTURE</span><h2>From interface<br />to infrastructure.</h2></div><span className="architecture-index">{project.number} — FLOW</span></div><div className="architecture-flow">{project.architecture.map((layer, index) => <div className="architecture-step" key={layer.label}><div className="architecture-node" data-reveal={index % 2 === 0 ? "left" : "right"} data-reveal-delay={(index % 4) + 1}><span>0{index + 1}</span><b>{layer.label}</b><small>{layer.detail}</small></div>{index < project.architecture.length - 1 ? <span className="flow-arrow" aria-hidden="true">→</span> : null}</div>)}</div></div></section>
      <section className="case-overview" data-snap><div className="case-label" data-reveal="left">04 / TOOLS &amp; TECHNOLOGY</div><div data-reveal="right"><h2>Technology choices</h2><div className="tag-list case-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>{project.note ? <p className="case-note">{project.note}</p> : null}</div></section>
      <div className="case-outbound">{project.live ? <a className="button button-primary" href={project.live} target="_blank" rel="noreferrer">Open live application <span aria-hidden="true">↗</span></a> : null}{project.github ? <a className="button button-outline" href={project.github} target="_blank" rel="noreferrer">View public repository <span aria-hidden="true">↗</span></a> : null}<AnchorJumpLink className="case-back" href="/#work">← Back to selected work</AnchorJumpLink></div>
    </main>
  );
}
