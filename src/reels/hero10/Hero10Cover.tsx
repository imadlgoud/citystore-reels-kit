import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { ProductImage } from "../../components/ProductImage";
import { OFFICIAL } from "./timeline";

/** 1080x1920 cover for the GoPro HERO10 Black (used) reel (key content inside the centre 4:5 band). */
export const Hero10Cover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  const cam = OFFICIAL.hero;
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={560} y={940} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "0 36px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>GoPro قوية بلا ثمن الجديدة!</div>
        <div style={{ ...heavy, fontSize: 60, letterSpacing: 8, marginTop: 14 }}>GoPro</div>
        <div style={{ ...heavy, fontSize: 130, letterSpacing: -2 }}>HERO10 <span style={{ fontSize: "0.5em", letterSpacing: 8 }}>BLACK</span></div>
      </div>
      <div style={{ position: "absolute", left: 200, top: 720, transform: "rotate(-4deg)", filter: "drop-shadow(0 40px 50px rgba(6,14,90,0.5))" }}>
        <ProductImage src={cam.src} aspect={cam.aspect} width={700} sweep={0.45} />
      </div>
      <div style={{ position: "absolute", right: 90, top: 660, transform: "rotate(-8deg)", background: "linear-gradient(90deg,#FFB020,#FF7A1A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "2px 26px 10px", borderRadius: 16, boxShadow: "0 14px 34px rgba(80,30,0,0.4)", letterSpacing: 2 }}>OCCASION</div>
      {/* single used unit: "first come, first served" highlighted */}
      <div style={{ position: "absolute", right: 60, top: 1300, transform: "rotate(-5deg)", background: "linear-gradient(90deg,#FFB020,#FF7A1A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 58, lineHeight: 1.08, textAlign: "center", padding: "14px 34px 20px", borderRadius: 24, border: "6px solid #fff", boxShadow: "0 20px 50px rgba(80,30,0,0.45)", whiteSpace: "nowrap" }}>
        PREMIER ARRIVÉ,<br />PREMIER SERVI !
      </div>
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="h10cover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
