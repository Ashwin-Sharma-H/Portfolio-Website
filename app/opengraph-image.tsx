import { ImageResponse } from "next/og";

export const alt = "Ashwin Sharma — AI/ML Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#101216", color: "#f2f0eb", padding: "68px", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-120px", top: "-180px", width: "680px", height: "680px", border: "1px solid rgba(197,238,108,.2)", borderRadius: "50%", display: "flex" }} />
      <div style={{ position: "absolute", right: "-20px", top: "-80px", width: "480px", height: "480px", border: "1px dashed rgba(169,161,247,.28)", borderRadius: "50%", display: "flex" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#c5ee6c", fontSize: "18px", letterSpacing: "5px" }}><span style={{ display: "flex", width: "42px", height: "42px", border: "1px solid rgba(255,255,255,.3)", borderRadius: "10px", alignItems: "center", justifyContent: "center", color: "#f2f0eb", letterSpacing: "-3px", fontSize: "23px", fontWeight: 800 }}>A<span style={{ color: "#c5ee6c" }}>.</span></span> AI / ML ENGINEER</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", fontSize: "68px", lineHeight: 1.06, fontWeight: 700, letterSpacing: "-4px" }}>Ashwin Sharma</div>
          <div style={{ display: "flex", fontSize: "32px", color: "#a9aab2", letterSpacing: "-1px" }}>Building AI systems for the real world.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#9b9ca4", fontSize: "15px", letterSpacing: "2px" }}><span>GENERATIVE AI · MACHINE LEARNING · SYSTEMS</span><span>PORTFOLIO / 2026</span></div>
      </div>
    </div>,
    size
  );
}
