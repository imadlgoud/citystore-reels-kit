import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, FONT } from "../../brand";
import { BrandBackground } from "../../components/BrandBackground";
import { Burst } from "../../components/SceneShell";
import { Citybot } from "../../citybot/Citybot";

/*
 * Covers for the real-footage "occasions" videos (shop footage, French on-screen text, no VO).
 * Brand cover layout (blue background, Citybot thumbs up, "متوفر عند CITY STORE" ribbon), but the products are real
 * frames from the video in photo cards, and the hook is the video's own opening title.
 * Key content stays inside the centre 3:4 band (y 240-1680) that the profile grid shows.
 */
type Props = { id: string; line1: string; line2: string; pill: string; photos: string[]; models: string[] };

const GREEN = "#2BD96B";

const Card: React.FC<{ src: string; w: number; x: number; y: number; rot: number; z: number }> = ({ src, w, x, y, rot, z }) => (
  <div
    style={{
      position: "absolute", left: x - w / 2, top: y, width: w, height: (w * 4) / 3, transform: `rotate(${rot}deg)`, zIndex: z,
      background: "#fff", padding: 10, borderRadius: 30, boxShadow: "0 30px 60px rgba(6,14,90,0.5)",
    }}
  >
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 22, display: "block" }} />
  </div>
);

export const OccasionCover: React.FC<Props> = ({ id, line1, line2, pill, photos, models }) => {
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 10px 34px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  const single = photos.length === 1;
  const cards = single
    ? [{ src: photos[0], w: 500, x: 505, y: 600, rot: -3, z: 2 }]
    : [
        { src: photos[1], w: 340, x: 255, y: 700, rot: -9, z: 1 },
        { src: photos[2], w: 340, x: 755, y: 700, rot: 9, z: 1 },
        { src: photos[0], w: 410, x: 505, y: 630, rot: 0, z: 2 },
      ];
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={505} y={900} r={1100} rot={8} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", top: 262, left: 0, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ ...heavy, fontSize: 74, letterSpacing: 1 }}>{line1}</div>
        <div style={{ transform: "rotate(-3deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: line2.length > 12 ? 88 : 104, lineHeight: 1, padding: "10px 40px 18px", borderRadius: 26, boxShadow: "0 18px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
          {line2}
        </div>
        <div style={{ marginTop: 10, background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 36, letterSpacing: 3, padding: "6px 26px 8px", borderRadius: 999, boxShadow: "0 10px 26px rgba(6,14,90,0.3)", whiteSpace: "nowrap" }}>
          {pill}
        </div>
      </div>
      {cards.map((c) => <Card key={c.src} {...c} />)}
      <div style={{ position: "absolute", right: single ? 140 : 100, top: single ? 590 : 625, zIndex: 5, transform: "rotate(-8deg)", background: "linear-gradient(90deg,#FFB020,#FF7A1A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "2px 24px 10px", borderRadius: 16, boxShadow: "0 14px 34px rgba(80,30,0,0.4)", letterSpacing: 2 }}>
        OCCASION
      </div>
      <div style={{ position: "absolute", left: 330, right: 110, top: single ? 1320 : 1265, zIndex: 6, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {models.map((m) => (
          <div key={m} style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "6px 20px 10px", borderRadius: 14, boxShadow: "0 8px 20px rgba(6,14,90,0.3)", whiteSpace: "nowrap" }}>
            {m}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 10, top: 1200, zIndex: 7 }}>
        <Citybot id={`${id}cover`} width={330} expression="excited" mouth="grin" tilt={-6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={12} />
      </div>
      <div style={{ position: "absolute", top: 1600, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 8 }}>
        <div dir="rtl" style={{ transform: "rotate(-4deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "4px 40px 14px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
          متوفر عند CITY STORE
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const OccIphoneCover: React.FC = () => (
  <OccasionCover id="occiphone" line1="TU CHERCHES" line2="UN iPHONE ?" pill="6 OCCASIONS DISPO"
    photos={["occasions/iphone_16pro.jpg", "occasions/iphone_15.jpg", "occasions/iphone_14.jpg"]}
    models={["iPhone 16 Pro", "iPhone 16", "iPhone 15", "iPhone 14"]} />
);
export const OccSamsungCover: React.FC = () => (
  <OccasionCover id="occsamsung" line1="TU CHERCHES" line2="UN GALAXY ?" pill="6 OCCASIONS DISPO"
    photos={["occasions/galaxy_s25u.jpg", "occasions/galaxy_s24p.jpg", "occasions/galaxy_s23u.jpg"]}
    models={["Galaxy S25 Ultra", "Galaxy S25", "Galaxy S24+", "Galaxy S23 Ultra"]} />
);
export const OccTabletsCover: React.FC = () => (
  <OccasionCover id="occtabs" line1="TU CHERCHES" line2="UNE TABLETTE ?" pill="3 OCCASIONS DISPO"
    photos={["occasions/ipad_2g.jpg", "occasions/ipad_m2.jpg", "occasions/tab_a.jpg"]}
    models={["iPad Pro 11\" M2", "iPad Pro 11\" (2e gén.)", "Galaxy Tab A (2019)"]} />
);
export const OccAndroidCover: React.FC = () => (
  <OccasionCover id="occandroid" line1="XIAOMI, PIXEL" line2="OU HONOR ?" pill="3 OCCASIONS DISPO"
    photos={["occasions/xiaomi_14t.jpg", "occasions/pixel_9a.jpg", "occasions/honor.jpg"]}
    models={["Xiaomi 14T", "Pixel 9a", "Honor 8 Lite"]} />
);
export const OccGoproCover: React.FC = () => (
  <OccasionCover id="occgopro" line1="ENVIE D'UNE" line2="GOPRO ?" pill="HERO10 BLACK D'OCCASION"
    photos={["occasions/gopro_front.jpg"]}
    models={["HERO10 Black", "Caméra d'action"]} />
);
