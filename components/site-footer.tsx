import { github, linkedin } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span>© {new Date().getFullYear()} Ashwin Sharma</span>
        <span className="footer-note">Designed around systems that work in the real world.</span>
        <div className="footer-links">
          <a href={github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
