import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, FONT_DISPLAY } from "../brand";
import { BrandBackground } from "../components/BrandBackground";
import { FacebookGlyph, LineIcon } from "../components/Icons";
import { Burst } from "../components/SceneShell";
import { Citybot } from "../citybot/Citybot";
import { SOCIAL } from "../config";

/*
 * City Store price-list story (1080x1920, 9:16): logo, title, 2-6 product cards (photo, name, NEUF / OCCASION,
 * optional spec line, price), then how to order. Fill it from src/pricelist/lists.ts and render with
 *   npx remotion still PriceList-<id> out/pricelist/<id>.png
 */
export type PriceItem = {
  name: string;
  /** path under public/, transparent cut-out */
  img: string;
  price: string; // e.g. "2100 DH"
  condition?: "neuf" | "occasion";
  spec?: string; // e.g. "256 Go · Batterie 87 %"
  /** image scale tweak inside its slot (1 = fit) */
  scale?: number;
  rotate?: number;
};
export type PriceListProps = {
  /** optional header under the logo; without title and subtitle the cards move up */
  title?: string;
  subtitle?: string; // small pill under the title (Darija or French)
  items: PriceItem[];
  whatsapp?: string;
  footnote?: string;
};

// Bebas Neue everywhere (Arabic falls back to Cairo); it is condensed, so sizes run ~1.3x Montserrat's
const F = FONT_DISPLAY;
const GREEN = "#1FBF5B";
const ORANGE = "#FF7A1A";
const INK = "#0F1C78";

const Condition: React.FC<{ c: "neuf" | "occasion"; size: number }> = ({ c, size }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.25, background: c === "neuf" ? GREEN : ORANGE, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: size, letterSpacing: 2, padding: `${size * 0.12}px ${size * 0.55}px ${size * 0.2}px ${size * 0.4}px`, borderRadius: 999 }}>
    <LineIcon name="check" size={size * 1.1} stroke={12} color="#fff" />
    {c === "neuf" ? "NEUF" : "OCCASION"}
  </div>
);

const Card: React.FC<{ it: PriceItem; w: number; h: number }> = ({ it, w, h }) => {
  const big = h > 420;
  const nameSize = big ? 54 : 46;
  const priceSize = big ? 78 : 66;
  return (
    <div style={{ position: "relative", width: w, height: h, background: "rgba(255,255,255,0.96)", borderRadius: 40, boxShadow: "0 24px 50px rgba(6,14,90,0.35)", display: "flex", flexDirection: "column", alignItems: "center", padding: `22px 18px ${priceSize * 1.05}px` }}>
      {/* product photo on a soft brand glow; takes whatever height the text leaves */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: "70%", aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.cyan}55 0%, ${COLORS.blue}22 60%, rgba(255,255,255,0) 72%)` }} />
        <Img src={staticFile(it.img)} style={{ position: "relative", maxWidth: "92%", maxHeight: "100%", transform: `scale(${it.scale ?? 1}) rotate(${it.rotate ?? 0}deg)`, filter: "drop-shadow(0 16px 20px rgba(6,14,90,0.35))" }} />
      </div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: F, fontWeight: 900, fontSize: nameSize, lineHeight: 1, letterSpacing: 1, color: INK }}>{it.name}</div>
      {it.spec && <div style={{ marginTop: 6, fontFamily: F, fontWeight: 700, fontSize: nameSize * 0.6, letterSpacing: 1.5, color: "#4A5594" }}>{it.spec}</div>}
      {/* NEUF / OCCASION badge on the top-left corner */}
      {it.condition && <div style={{ position: "absolute", top: -18, left: -10, transform: "rotate(-6deg)", boxShadow: "0 8px 18px rgba(6,14,90,0.3)", borderRadius: 999 }}><Condition c={it.condition} size={big ? 36 : 32} /></div>}
      {/* price tag overlapping the bottom edge */}
      <div style={{ position: "absolute", bottom: -priceSize * 0.55, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, color: "#fff", fontFamily: F, fontWeight: 900, fontSize: priceSize, lineHeight: 1, letterSpacing: 2, padding: "12px 40px 10px", borderRadius: 999, border: "6px solid #fff", boxShadow: "0 14px 30px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
        {it.price}
      </div>
    </div>
  );
};

export const PriceList: React.FC<PriceListProps> = ({ title, subtitle, items, whatsapp = "+212 633 93 28 28", footnote = "Derb Ghallef, Casablanca · Livraison partout au Maroc" }) => {
  const n = Math.max(1, Math.min(items.length, 6));
  const rows = n <= 2 ? 1 : n <= 4 ? 2 : 3;
  const cols = n === 1 ? 1 : 2;
  const header = !!(title || subtitle);
  const gridTop = header ? 545 : 370, gridBottom = 1490, gapX = 40, gapY = 84;
  const w = cols === 1 ? 640 : 475;
  const h = Math.min(600, (gridBottom - gridTop - gapY * (rows - 1)) / rows);
  const heavy: React.CSSProperties = { fontFamily: F, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 10px 30px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={540} y={1000} r={1200} rot={6} opacity={0.16} rays={22} />
      {/* logo */}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Img src={staticFile("logo/city.png")} style={{ width: 300 }} />
        <Img src={staticFile("logo/storema.png")} style={{ width: 300 }} />
      </div>
      {/* title (optional) */}
      {header && <div style={{ position: "absolute", top: 345, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {title && <div style={{ ...heavy, fontSize: title.length > 16 ? 84 : 100, letterSpacing: 2 }}>{title}</div>}
        {subtitle && (
          <div dir="auto" style={{ background: "#fff", color: COLORS.blue, fontFamily: F, fontWeight: 900, fontSize: 44, letterSpacing: 1, padding: "6px 28px 4px", borderRadius: 999, boxShadow: "0 10px 26px rgba(6,14,90,0.3)", whiteSpace: "nowrap" }}>{subtitle}</div>
        )}
      </div>}
      {/* products */}
      <div style={{ position: "absolute", top: gridTop, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gapX, rowGap: gapY }}>
        {items.slice(0, 6).map((it, i) => (
          <Card key={i} it={it} w={w} h={h} />
        ))}
      </div>
      {/* how to order */}
      <div style={{ position: "absolute", top: 1590, left: 60, right: 230, display: "flex", flexDirection: "column", gap: 14 }}>
        <div dir="rtl" style={{ ...heavy, fontSize: 44, textAlign: "right" }}>كوموندي دابا فـ WhatsApp</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, alignSelf: "flex-end" }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}>
            <LineIcon name="call" size={38} stroke={9} color="#fff" />
          </div>
          <div style={{ ...heavy, fontSize: 70, letterSpacing: 2 }}>{whatsapp}</div>
        </div>
        <div style={{ display: "flex", gap: 22, alignSelf: "flex-end", alignItems: "center", fontFamily: F, fontWeight: 800, fontSize: 40, letterSpacing: 1.5, color: "#fff" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><LineIcon name="instagram" size={40} stroke={8} />{SOCIAL.instagram}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><FacebookGlyph size={40} />{SOCIAL.facebook}</span>
        </div>
        <div style={{ alignSelf: "flex-end", fontFamily: F, fontWeight: 700, fontSize: 34, letterSpacing: 1.5, color: "rgba(255,255,255,0.9)" }}>{footnote}</div>
      </div>
      <div style={{ position: "absolute", right: 10, top: 1555 }}>
        <Citybot id="pricelist" width={210} expression="happy" mouth="smile" tilt={6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={8} />
      </div>
      {/* website bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontWeight: 900, fontSize: 48, color: COLORS.blue, letterSpacing: 6, paddingTop: 4 }}>
        WWW.CITYSTORE.MA
      </div>
    </AbsoluteFill>
  );
};
