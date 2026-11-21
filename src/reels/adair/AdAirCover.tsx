import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT } from "../../brand";

/** 1080x1920 ad cover: the store robot presenting the MacBook Air box, "MacBook Air M4" + DISPONIBLE (gift offer removed). */
const INK = "#0B0D17";
const outline = (w: number) => `${-w}px ${-w}px 0 ${INK}, ${w}px ${-w}px 0 ${INK}, ${-w}px ${w}px 0 ${INK}, ${w}px ${w}px 0 ${INK}, 0 ${w * 1.6}px 0 ${INK}`;

export const AdAirCover: React.FC = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Img src={staticFile("adair/clip/robot_lift.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, transform: "scale(1.12)", transformOrigin: "50% 45%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,13,23,0.9) 0%, rgba(11,13,23,0.15) 30%, rgba(11,13,23,0) 55%, rgba(11,13,23,0.9) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 118, color: "#fff", textShadow: outline(6), whiteSpace: "nowrap" }}>MacBook Air M4</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#22C55E", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "10px 36px", borderRadius: 22, border: `6px solid ${INK}`, transform: "rotate(-3deg)" }}>
        <svg viewBox="0 0 70 70" width={64} height={64}><path d="M14 36 L29 51 L57 20" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></svg>
        DISPONIBLE
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: outline(3) }}>Originaux · Garantie · Livraison partout au Maroc</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(11,13,23,0.6)", padding: "8px 24px 8px 8px", borderRadius: 999 }}>
        <Img src={staticFile("logo/logo.png")} style={{ width: 64, height: 64, borderRadius: "50%" }} />
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff" }}>citystore.ma</span>
      </div>
    </div>
  </AbsoluteFill>
);
