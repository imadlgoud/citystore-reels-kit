import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { ProductImage } from "../../components/ProductImage";
import { OFFICIAL } from "./timeline";

/** 1080x1920 cover for the e-readers reel (key content inside the centre 4:5 band). */
export const Readers2Cover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1.05, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  const img = (k: keyof typeof OFFICIAL, x: number, y: number, w: number, r: number) => (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)`, filter: "drop-shadow(0 34px 44px rgba(6,14,90,0.5))" }}>
      <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} />
    </div>
  );
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={560} y={960} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>كيعياو ليك عينيك فالتيليفون؟</div>
        <div style={{ ...heavy, fontSize: 104, marginTop: 10 }}>Les liseuses</div>
        <div style={{ ...heavy, fontSize: 42, fontWeight: 800 }}>Kindle 11 · Kobo Libra Colour</div>
      </div>
      {img("green_pair", 330, 760, 360, -6)}
      {img("kobo", 640, 780, 280, 6)}
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="r2cover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
