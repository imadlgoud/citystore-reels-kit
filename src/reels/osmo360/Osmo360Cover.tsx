import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { ProductImage } from "../../components/ProductImage";
import { OFFICIAL } from "./timeline";

/** 1080x1920 cover for the DJI Osmo 360 reel (key content inside the centre 4:5 band). */
export const Osmo360Cover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1.05, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={560} y={960} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "2px 36px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>صوّر كلشي… واختار الزاوية من بعد!</div>
        <div style={{ ...heavy, fontSize: 44, letterSpacing: 14, marginTop: 10 }}>DJI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, ...heavy }}>
          <span style={{ fontSize: 110 }}>Osmo</span>
          <span style={{ fontSize: 114, color: COLORS.blue, background: "#fff", padding: "0 26px 4px", borderRadius: 20, textShadow: "none" }}>360</span>
        </div>
        <div style={{ ...heavy, fontSize: 38, fontWeight: 800 }}>Standard Combo · 8K · 360°</div>
      </div>
      <div style={{ position: "absolute", left: 370, top: 760, transform: "rotate(-5deg)", filter: "drop-shadow(0 40px 50px rgba(6,14,90,0.5))" }}>
        <ProductImage src={OFFICIAL.logo.src} aspect={OFFICIAL.logo.aspect} width={330} sweep={0.45} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 830, transform: "rotate(6deg)", filter: "drop-shadow(0 40px 50px rgba(6,14,90,0.5))" }}>
        <ProductImage src={OFFICIAL.screen.src} aspect={OFFICIAL.screen.aspect} width={300} />
      </div>
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="o3cover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
