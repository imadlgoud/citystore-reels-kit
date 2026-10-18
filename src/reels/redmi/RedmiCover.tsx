import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { RedmiFan } from "./RSScenes";

/** 1080x1920 cover for the Redmi 5G comparison reel (key content inside the centre 4:5 band). */
export const RedmiCover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1.1, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={540} y={940} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div dir="rtl" style={{ ...heavy, fontSize: 88 }}>شكون فيهم تختار؟</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "4px 36px 8px", borderRadius: 999, letterSpacing: 2 }}>3 REDMI 5G</div>
        </div>
        <div style={{ ...heavy, fontSize: 34, fontWeight: 800 }}>Note 15 · Note 14 Pro+ · Note 14</div>
      </div>
      <RedmiFan cx={560} cy={880} w={380} dx={250} />
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="rscover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
