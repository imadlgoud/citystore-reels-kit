import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT } from "../../brand";

/** 1080x1920 ad cover: the store robot presenting the MacBook Air box, "MacBook Air M4 + CADEAU SURPRISE". */
const INK = "#0B0D17", YELLOW = "#FFD23F", RED = "#E8322E";
const outline = (w: number) => `${-w}px ${-w}px 0 ${INK}, ${w}px ${-w}px 0 ${INK}, ${-w}px ${w}px 0 ${INK}, ${w}px ${w}px 0 ${INK}, 0 ${w * 1.6}px 0 ${INK}`;

export const AdAirCover: React.FC = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Img src={staticFile("adair/clip/robot_lift.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, transform: "scale(1.12)", transformOrigin: "50% 45%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,13,23,0.9) 0%, rgba(11,13,23,0.15) 30%, rgba(11,13,23,0) 55%, rgba(11,13,23,0.9) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 118, color: "#fff", textShadow: outline(6), whiteSpace: "nowrap" }}>MacBook Air M4</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: YELLOW, color: INK, fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "10px 34px", borderRadius: 22, border: `6px solid ${INK}`, transform: "rotate(-3deg)" }}>
        <svg viewBox="0 0 100 100" width={78} height={78}>
          <rect x={14} y={42} width={72} height={52} rx={6} fill={RED} stroke={INK} strokeWidth={5} />
          <rect x={44} y={42} width={12} height={52} fill={YELLOW} stroke={INK} strokeWidth={3} />
          <rect x={8} y={28} width={84} height={18} rx={5} fill={RED} stroke={INK} strokeWidth={5} />
          <path d="M50 28 C38 8 18 14 30 26 Z M50 28 C62 8 82 14 70 26 Z" fill={YELLOW} stroke={INK} strokeWidth={4} />
        </svg>
        + CADEAU SURPRISE
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
