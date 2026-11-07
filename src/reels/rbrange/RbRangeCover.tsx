import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { ProductImage } from "../../components/ProductImage";
import { OFFICIAL } from "./timeline";

const FAN: { k: "w3_angle" | "aviator" | "w2" | "headliner"; x: number; y: number; r: number }[] = [
  { k: "aviator", x: 420, y: 700, r: -6 },
  { k: "w3_angle", x: 480, y: 860, r: 3 },
  { k: "headliner", x: 420, y: 1020, r: -4 },
  { k: "w2", x: 520, y: 1180, r: 5 },
];

/** 1080x1920 cover for the Ray-Ban Meta range reel (key content inside the centre 4:5 band). */
export const RbRangeCover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1.05, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={560} y={960} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 46, padding: "2px 32px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>ما تشريش حتى تشوف هاد الفيديو!</div>
        <div style={{ ...heavy, fontSize: 100, marginTop: 10 }}>Ray-Ban Meta</div>
        <div style={{ ...heavy, fontSize: 44, fontWeight: 800 }}>4 modèles disponibles</div>
      </div>
      {FAN.map((f) => (
        <div key={f.k} style={{ position: "absolute", left: f.x, top: f.y, transform: `rotate(${f.r}deg)`, filter: "drop-shadow(0 30px 40px rgba(6,14,90,0.5))" }}>
          <ProductImage src={OFFICIAL[f.k].src} aspect={OFFICIAL[f.k].aspect} width={420} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="rrcover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
