"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const MODEL_VIEWER_URL = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js";

export function ResumeTurbine() {
  const stageRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  useEffect(() => {
    let cancelled = false;
    let timeout: number | undefined;
    let viewer: HTMLElement | undefined;
    const stage = stageRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mountViewer = () => {
      if (cancelled || !stage || viewer) return;
      viewer = document.createElement("model-viewer");
      viewer.setAttribute("src", "/models/data-flow-turbine.glb");
      viewer.setAttribute("alt", "A horizontal data pipeline with transparent cyan input flow, a rotating internal turbine, and lime output flow.");
      viewer.setAttribute("poster", "/models/data-flow-turbine.png");
      viewer.setAttribute("loading", "lazy");
      viewer.setAttribute("reveal", "auto");
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("disable-pan", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("camera-orbit", "28deg 66deg 145%");
      viewer.setAttribute("camera-target", "0m 0.85m 0m");
      viewer.setAttribute("field-of-view", "32deg");
      viewer.setAttribute("shadow-intensity", "0.55");
      viewer.setAttribute("exposure", "1.15");
      viewer.setAttribute("interaction-prompt", "none");
      if (!reducedMotion) {
        viewer.setAttribute("autoplay", "");
        viewer.setAttribute("animation-name", "Rotor and data flow");
        viewer.setAttribute("auto-rotate", "");
        viewer.setAttribute("rotation-per-second", "12deg");
        viewer.setAttribute("auto-rotate-delay", "1200");
      }
      viewer.addEventListener("load", () => {
        loadedRef.current = true;
        setLoaded(true);
        setViewerReady(true);
      }, { once: true });
      viewer.addEventListener("error", () => setViewerReady(false), { once: true });
      stage.appendChild(viewer);
      setViewerReady(true);
      timeout = window.setTimeout(() => {
        if (!cancelled && !loadedRef.current) setViewerReady(false);
      }, 10000);
    };

    if (customElements.get("model-viewer")) mountViewer();
    else customElements.whenDefined("model-viewer").then(mountViewer);

    return () => {
      cancelled = true;
      if (timeout !== undefined) window.clearTimeout(timeout);
      viewer?.remove();
    };
  }, []);

  useEffect(() => {
    const viewer = stageRef.current?.querySelector("model-viewer") as
      | (HTMLElement & { pause?: () => void; play?: () => void })
      | undefined;
    if (viewMode === "2d") viewer?.pause?.();
    else viewer?.play?.();
  }, [viewMode, loaded, viewerReady]);

  return (
    <div className="resume-turbine-wrap" aria-label="Data pipeline turbine with switchable two-dimensional and three-dimensional views">
      <Script src={MODEL_VIEWER_URL} type="module" strategy="afterInteractive" />
      <div className="resume-turbine-stage" aria-label="Data pipeline turbine illustration">
        <div className={`resume-turbine-model${viewMode === "2d" ? " is-hidden" : ""}`} ref={stageRef} aria-hidden={viewMode === "2d"}>
          <img className={`resume-turbine-poster${loaded ? " is-loaded" : ""}`} src="/models/data-flow-turbine.png" alt="" aria-hidden="true" />
          {!viewerReady && <span className="resume-turbine-status">3D model preview</span>}
        </div>
        <svg className={`resume-turbine-illustration${viewMode === "2d" ? " is-visible" : ""}`} viewBox="0 0 800 420" role="img" aria-label="Two-dimensional turbine diagram showing data flowing from intake through a spinning turbine to the delivery outlet">
          <defs>
            <linearGradient id="turbine-shell" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#394751"/><stop offset=".45" stopColor="#161c23"/><stop offset="1" stopColor="#303c45"/></linearGradient>
            <linearGradient id="turbine-glass" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#52d8e8" stopOpacity=".2"/><stop offset="1" stopColor="#183b48" stopOpacity=".1"/></linearGradient>
            <linearGradient id="turbine-flow"><stop stopColor="#3bc9f0"/><stop offset=".52" stopColor="#98f3cf"/><stop offset="1" stopColor="#c5ee6c"/></linearGradient>
            <filter id="turbine-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path d="M54 177 C100 177 111 196 151 196 H649 C690 196 703 177 746 177" fill="none" stroke="#33404a" strokeWidth="74" strokeLinecap="round"/>
          <path d="M54 177 C100 177 111 196 151 196 H649 C690 196 703 177 746 177" fill="none" stroke="url(#turbine-glass)" strokeWidth="62" strokeLinecap="round"/>
          <path d="M55 177 C100 177 111 196 151 196 H649 C690 196 703 177 746 177" fill="none" stroke="url(#turbine-flow)" strokeWidth="5" strokeDasharray="2 18" strokeLinecap="round" className="resume-turbine-flowline"/>
          <path d="M82 151 H171 L207 168 V224 L171 241 H82 Q62 241 62 221 V171 Q62 151 82 151Z" fill="url(#turbine-shell)" stroke="#9ab1bc" strokeOpacity=".65" strokeWidth="2"/>
          <path d="M718 151 H629 L593 168 V224 L629 241 H718 Q738 241 738 221 V171 Q738 151 718 151Z" fill="url(#turbine-shell)" stroke="#9ab1bc" strokeOpacity=".65" strokeWidth="2"/>
          <path d="M197 157 H603 Q618 157 618 172 V220 Q618 235 603 235 H197 Q182 235 182 220 V172 Q182 157 197 157Z" fill="url(#turbine-glass)" stroke="#69d9e4" strokeOpacity=".7" strokeWidth="2"/>
          <path d="M218 157 V235 M234 157 V235 M566 157 V235 M582 157 V235" stroke="#aabac1" strokeOpacity=".42" strokeWidth="5"/>
          <ellipse cx="400" cy="196" rx="106" ry="72" fill="#11161d" fillOpacity=".76" stroke="#68d9e6" strokeOpacity=".65" strokeWidth="3"/>
          <g transform="translate(400 196)"><g className="resume-turbine-rotor">
            <circle r="57" fill="none" stroke="#c5ee6c" strokeOpacity=".32" strokeWidth="2"/>
            {Array.from({ length: 7 }, (_, i) => <path key={i} d="M9 -8 C21 -20 32 -42 43 -58 C51 -47 52 -32 41 -17 C31 -5 18 1 9 7Z" transform={`rotate(${i * (360 / 7)})`} fill={i % 3 === 0 ? "#c5ee6c" : "#8fa9b5"} fillOpacity={i % 3 === 0 ? ".76" : ".9"} stroke="#d4e2dc" strokeOpacity=".5" strokeWidth="1.2" />)}
            <circle r="16" fill="#17242b" stroke="#c5ee6c" strokeWidth="3"/><circle r="5" fill="#c5ee6c" filter="url(#turbine-glow)"/>
          </g></g>
          <g fill="#bded6a" filter="url(#turbine-glow)"><circle r="4"><animateMotion dur="3.8s" repeatCount="indefinite" path="M60 177 C100 177 111 196 151 196 H649 C690 196 703 177 740 177"/></circle><circle r="3" fill="#55d6ef"><animateMotion dur="3.8s" begin="-1.4s" repeatCount="indefinite" path="M60 177 C100 177 111 196 151 196 H649 C690 196 703 177 740 177"/></circle></g>
          <path d="M258 278 H542 L565 304 H235Z" fill="url(#turbine-shell)" stroke="#56646d" strokeWidth="2"/><path d="M254 305 H546" stroke="url(#turbine-flow)" strokeWidth="3"/>
          <path d="M286 235 V278 M514 235 V278" stroke="#91a1aa" strokeOpacity=".65" strokeWidth="7"/>
          <g fill="#c5ee6c" fontFamily="monospace" fontSize="11" letterSpacing="2"><text x="76" y="118">INTAKE</text><text x="363" y="112">TURBINE STAGE</text><text x="661" y="118">OUTPUT</text></g>
        </svg>
        <div className="resume-turbine-corner resume-turbine-top" aria-hidden="true"><i /> AI SYSTEMS / 001</div>
        <div className="resume-turbine-toggle" role="group" aria-label="Turbine view">
          <button type="button" aria-pressed={viewMode === "2d"} onClick={() => setViewMode("2d")}>2D</button>
          <button type="button" aria-pressed={viewMode === "3d"} onClick={() => setViewMode("3d")}>3D</button>
        </div>
        <div className="resume-turbine-corner resume-turbine-bottom" aria-hidden="true">
          <b>DATA PIPELINE</b>
          <div className="resume-turbine-steps"><span>INGEST</span><i>→</i><span>PROCESS</span><i>→</i><span>DELIVER</span></div>
        </div>
      </div>
    </div>
  );
}
