import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { ProductImage } from "../../components/ProductImage";
import { OFFICIAL } from "./timeline";

/** 1080x1920 cover for the iPhone 15 Pro Max reel (key content inside the centre 4:5 band). */
export const Ip15pmCover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1.05, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={560} y={960} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>جديد، باقي مسدود فالبواطة!</div>
        <div style={{ ...heavy, fontSize: 104, marginTop: 10 }}>iPhone 15 Pro Max</div>
        <div style={{ ...heavy, fontSize: 44, fontWeight: 800 }}>1 To · Blue Titanium</div>
      </div>
      <div style={{ position: "absolute", left: 400, top: 720, transform: "rotate(-3deg)", filter: "drop-shadow(0 40px 50px rgba(6,14,90,0.5))" }}>
        <ProductImage src={OFFICIAL.pair.src} aspect={OFFICIAL.pair.aspect} width={500} sweep={0.45} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 700, transform: "rotate(10deg)", background: "#FF3B5C", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 46, padding: "2px 24px 10px", borderRadius: 16, border: "5px solid #fff", boxShadow: "0 14px 34px rgba(80,0,20,0.4)", letterSpacing: 2 }}>SCELLÉ</div>
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="p5cover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
