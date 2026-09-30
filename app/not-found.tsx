import Link from "next/link";

export default function NotFound() {
  return <main className="not-found shell"><p className="eyebrow">404 / NOT FOUND</p><h1>This page<br /><span>isn’t here.</span></h1><Link className="button button-primary" href="/">Return home ↗</Link></main>;
}
