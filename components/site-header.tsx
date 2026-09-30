import Link from "next/link";
import { AnchorJumpLink } from "@/components/anchor-jump-link";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#professional-work", label: "Practice" },
  { href: "/#experience", label: "Experience" },
  { href: "/#certifications", label: "Credentials" },
  { href: "/#contact", label: "Contact" }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link className="wordmark" href="/" aria-label="Ashwin Sharma home">
          <span className="wordmark-mark" aria-hidden="true"><span className="wordmark-initials">AS</span><span className="wordmark-signal" /></span>
          <span className="wordmark-copy">Ashwin Sharma<small>AI / ML ENGINEER</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => <AnchorJumpLink href={link.href} key={link.href}>{link.label}</AnchorJumpLink>)}
        </nav>
        <AnchorJumpLink className="availability" href="/#contact"><span aria-hidden="true" /> AI / ML · GENAI</AnchorJumpLink>
      </div>
    </header>
  );
}
