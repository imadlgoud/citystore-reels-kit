import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";
import { ProductImage } from "../../components/ProductImage";
import { OFFICIAL } from "./timeline";

const LINEUP: { k: keyof typeof OFFICIAL; label: string; rot: number }[] = [
  { k: "pro", label: "Pro", rot: -10 },
  { k: "gen2", label: "2e gén.", rot: -3 },
  { k: "gen1", label: "1re gén.", rot: 4 },
  { k: "usbc", label: "USB-C", rot: 11 },
];

/** 1080x1920 cover for the Apple Pencil range reel (key content inside the centre 4:5 band). */
export const PencilsCover: React.FC = () => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1.05, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={560} y={960} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div dir="rtl" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 48, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>شمن وحدة كتمشي مع الآيباد ديالك؟</div>
        <div style={{ ...heavy, fontSize: 120, marginTop: 10 }}>Apple Pencil</div>
        <div style={{ ...heavy, fontSize: 46, fontWeight: 800 }}>4 modèles disponibles</div>
      </div>
      {LINEUP.map((p, i) => {
        const H = 560;
        const W = H / OFFICIAL[p.k].aspect;
        return (
          <div key={p.k} style={{ position: "absolute", left: 420 + i * 130, top: 740, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, width: 110 }}>
            <div style={{ transform: `rotate(${p.rot}deg)`, filter: "drop-shadow(0 30px 36px rgba(6,14,90,0.5))" }}>
              <ProductImage src={OFFICIAL[p.k].src} aspect={OFFICIAL[p.k].aspect} width={W} />
            </div>
            <div style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 26, padding: "0 12px 4px", borderRadius: 999, whiteSpace: "nowrap" }}>{p.label}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 20, top: 1150 }}>
        <Citybot id="pncover" width={370} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1610, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};
