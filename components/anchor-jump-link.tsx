"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type AnchorJumpLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

let cancelAnchorNavigation: (() => void) | null = null;

function beginAnchorNavigation(event: MouseEvent<HTMLAnchorElement>) {
  const changesRoute = new URL(event.currentTarget.href).pathname !== window.location.pathname;
  cancelAnchorNavigation?.();
  const root = document.documentElement;
  root.classList.add("anchor-navigating");
  window.dispatchEvent(new Event("portfolio:anchor-navigation-start"));

  let sawScroll = false;
  let fallbackTimer = 0;
  const finish = () => {
    window.clearTimeout(fallbackTimer);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("scrollend", finish);
    if (cancelAnchorNavigation === finish) cancelAnchorNavigation = null;
    root.classList.remove("anchor-navigating");
    window.dispatchEvent(new Event("portfolio:anchor-navigation-end"));
  };
  const onScroll = () => {
    sawScroll = true;
    window.clearTimeout(fallbackTimer);
    fallbackTimer = window.setTimeout(finish, 180);
  };

  cancelAnchorNavigation = finish;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", finish, { once: true });
  fallbackTimer = window.setTimeout(() => {
    if (!sawScroll) finish();
    else fallbackTimer = window.setTimeout(finish, 1800);
  }, changesRoute ? 2200 : 120);
}

export function AnchorJumpLink({ href, className, children }: AnchorJumpLinkProps) {
  return <Link href={href} className={className} onClick={beginAnchorNavigation}>{children}</Link>;
}
