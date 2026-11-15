import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { LayoutProvider, LAYOUT_9x16 } from "../../layout";
import { RealDuo } from "./RealDuo";
import { ARM, Hamza } from "./Hamza";
import { RoomBack } from "./Room";

/** 1080x1920 thumbnail: Hamza squinting at a tiny phone (warm room, left) vs the unfolded iPhone Duo (brand, right). */
export const Hamza2Thumb: React.FC = () => (
  <LayoutProvider layout={LAYOUT_9x16}>
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 52% 0, 40% 100%, 0 100%)" }}>
        <RoomBack sofaTop={1360} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={1080 * 0.52} y1={0} x2={1080 * 0.4} y2={1920} stroke="#fff" strokeWidth={14} />
      </svg>
      <div style={{ position: "absolute", left: -70, top: 760 }}>
        <Hamza id="hzt" legs={false} width={600} expr="squint" arms={ARM.phoneUp} held="phone" lookY={0.8} lean={5} tilt={6} />
      </div>
      <Burst x={790} y={1050} r={520} rot={10} opacity={0.3} rays={18} />
      <div style={{ position: "absolute", left: 560, top: 820, transform: "rotate(6deg)", filter: "drop-shadow(0 30px 40px rgba(6,14,90,0.5))" }}>
        <RealDuo id="rdt" w={480} open={1} t={1.2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 110, lineHeight: 1.25, padding: "0 50px 10px", borderRadius: 40, boxShadow: "0 20px 44px rgba(6,14,90,0.45)", transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>
          الكورة قد النملة
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: "#fff", textShadow: "0 10px 30px rgba(8,20,110,0.5)", marginTop: 10 }}>iPhone Duo</div>
      </div>
      <div style={{ position: "absolute", top: 1590, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  </LayoutProvider>
);
