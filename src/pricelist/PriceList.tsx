import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, FONT, FONT_DISPLAY } from "../brand";
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
  /** e.g. "2100 DH"; leave out on availability cards to drop the tag */
  price?: string;
  condition?: "neuf" | "occasion";
  spec?: string; // e.g. "256 Go · Batterie 87 %"
  /** availability list (e.g. storage sizes): switches to the side-by-side card, one "DISPONIBLE" chip per entry */
  stock?: string[];
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

// Text in Montserrat Black (Arabic falls back to Cairo); prices in Bebas Neue
const GREEN = "#1FBF5B";
const ORANGE = "#FF7A1A";
const INK = "#0F1C78";

const Condition: React.FC<{ c: "neuf" | "occasion"; size: number }> = ({ c, size }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.25, background: c === "neuf" ? GREEN : ORANGE, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: 2, padding: `${size * 0.12}px ${size * 0.55}px ${size * 0.2}px ${size * 0.4}px`, borderRadius: 999 }}>
    <LineIcon name="check" size={size * 1.1} stroke={12} color="#fff" />
    {c === "neuf" ? "NEUF" : "OCCASION"}
  </div>
);

/** placeholder shown when a product photo is still missing (img: "") */
const PhotoSlot: React.FC = () => (
  <div style={{ width: "88%", height: "88%", border: "4px dashed #9AA6D8", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "#9AA6D8", fontFamily: FONT, fontWeight: 900, fontSize: 20 }}>
    <LineIcon name="phone" size={60} stroke={7} color="#9AA6D8" />
    PHOTO
  </div>
);

/* availability card: big photo on top, name, then the sizes stacked one under the other (each with its own
   "✓ DISPONIBLE"), tag at the bottom. Fixed rows so cards in the same row line up. */
const StockCard: React.FC<{ it: PriceItem; w: number; h: number; maxRows: number }> = ({ it, w, h, maxRows }) => {
  const tagSize = 40;
  const padTop = 12, padBottom = it.price ? tagSize * 1.1 : 16;
  const nameMax = 30;
  const nameSize = Math.min(nameMax, (w - 40) / (it.name.length * 0.68));
  const rowH = 36, rowGap = 5; // maxRows: the longest list in the story, so every card keeps the same rows
  const sizesH = rowH * maxRows + rowGap * (maxRows - 1); // same height whatever the number of sizes
  const specH = it.spec ? 30 : 0; // optional line under the name (e.g. "Wi-Fi + 5G")
  const slotH = h - padTop - padBottom - nameMax * 1.15 - 4 - specH - sizesH - 8;
  return (
    <div style={{ position: "relative", width: w, height: h, background: "rgba(255,255,255,0.96)", borderRadius: 36, boxShadow: "0 24px 50px rgba(6,14,90,0.35)", display: "flex", flexDirection: "column", alignItems: "center", padding: `${padTop}px 10px ${padBottom}px` }}>
      <div style={{ position: "relative", height: slotH, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 0, width: slotH, height: slotH, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.cyan}55 0%, ${COLORS.blue}22 60%, rgba(255,255,255,0) 72%)` }} />
        {it.img ? (
          <Img src={staticFile(it.img)} style={{ position: "relative", maxWidth: "96%", maxHeight: "100%", transformOrigin: "bottom center", transform: `scale(${it.scale ?? 1}) rotate(${it.rotate ?? 0}deg)`, filter: "drop-shadow(0 14px 18px rgba(6,14,90,0.35))" }} />
        ) : (
          <PhotoSlot />
        )}
      </div>
      <div style={{ marginTop: 4, height: nameMax * 1.15, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: nameSize, lineHeight: 1, color: INK, whiteSpace: "nowrap" }}>{it.name}</div>
      {it.spec && <div style={{ height: specH, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#4A5594", whiteSpace: "nowrap" }}>{it.spec}</div>}
      <div style={{ marginTop: 8, height: sizesH, display: "flex", flexDirection: "column", gap: rowGap }}>
        {(it.stock ?? []).map((r) => (
          <div key={r} style={{ height: rowH, width: 360, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#EEF2FF", borderRadius: 999, padding: "0 4px 0 18px" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 25, color: INK, whiteSpace: "nowrap" }}>{r}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 18, letterSpacing: 0.5, padding: "3px 14px 4px 8px", borderRadius: 999 }}>
              <LineIcon name="check" size={20} stroke={12} color="#fff" />DISPONIBLE
            </span>
          </div>
        ))}
      </div>
      {it.condition && <div style={{ position: "absolute", top: -16, left: -10, transform: "rotate(-6deg)", boxShadow: "0 8px 18px rgba(6,14,90,0.3)", borderRadius: 999 }}><Condition c={it.condition} size={22} /></div>}
      {it.price && (
        <div style={{ position: "absolute", bottom: -tagSize * 0.55, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: tagSize, lineHeight: 1, letterSpacing: 2, padding: "8px 30px 6px", borderRadius: 999, border: "5px solid #fff", boxShadow: "0 14px 30px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
          {it.price}
        </div>
      )}
    </div>
  );
};

const Card: React.FC<{ it: PriceItem; w: number; h: number }> = ({ it, w, h }) => {
  const big = h > 420;
  const priceSize = big ? 78 : 66;
  // fixed rows so every card in a row lines up: photo slot (products stand on the same line), one name line, one
  // spec line (kept empty when there is no spec), then the price tag
  const nameMax = big ? 40 : 34;
  const nameSize = Math.min(nameMax, (w - 44) / (it.name.length * 0.68));
  const specSize = nameMax * 0.62;
  const textH = nameMax * 1.15 + 6 + specSize * 1.3;
  const padTop = 24, padBottom = priceSize * 0.95;
  const slotH = h - padTop - padBottom - textH - 10;
  return (
    <div style={{ position: "relative", width: w, height: h, background: "rgba(255,255,255,0.96)", borderRadius: 40, boxShadow: "0 24px 50px rgba(6,14,90,0.35)", display: "flex", flexDirection: "column", alignItems: "center", padding: `${padTop}px 18px ${padBottom}px` }}>
      {/* product photo on a soft brand glow, standing on the bottom of its slot */}
      <div style={{ position: "relative", height: slotH, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: "8%", width: slotH * 0.9, height: slotH * 0.9, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.cyan}55 0%, ${COLORS.blue}22 60%, rgba(255,255,255,0) 72%)` }} />
        <Img src={staticFile(it.img)} style={{ position: "relative", maxWidth: "92%", maxHeight: "100%", transformOrigin: "bottom center", transform: `scale(${it.scale ?? 1}) rotate(${it.rotate ?? 0}deg)`, filter: "drop-shadow(0 16px 20px rgba(6,14,90,0.35))" }} />
      </div>
      <div style={{ marginTop: 10, height: nameMax * 1.15, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: nameSize, lineHeight: 1, color: INK, whiteSpace: "nowrap" }}>{it.name}</div>
      <div style={{ marginTop: 6, height: specSize * 1.3, fontFamily: FONT, fontWeight: 700, fontSize: specSize, lineHeight: 1.3, color: "#4A5594", whiteSpace: "nowrap" }}>{it.spec ?? ""}</div>
      {/* NEUF / OCCASION badge on the top-left corner */}
      {it.condition && <div style={{ position: "absolute", top: -18, left: -10, transform: "rotate(-6deg)", boxShadow: "0 8px 18px rgba(6,14,90,0.3)", borderRadius: 999 }}><Condition c={it.condition} size={big ? 28 : 24} /></div>}
      {/* price tag (Bebas Neue) overlapping the bottom edge */}
      <div style={{ position: "absolute", bottom: -priceSize * 0.55, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: priceSize, lineHeight: 1, letterSpacing: 2, padding: "12px 40px 10px", borderRadius: 999, border: "6px solid #fff", boxShadow: "0 14px 30px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
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
  const stockList = items.some((it) => it.stock);
  const maxRows = Math.max(1, ...items.map((it) => it.stock?.length ?? 0));
  const gridTop = header ? 545 : stockList ? 245 : 345, gridBottom = stockList ? 1598 : 1500, gapX = stockList ? 30 : 40, gapY = stockList ? 34 : 84;
  const footTop = stockList ? 1628 : 1590;
  const w = cols === 1 ? 640 : stockList ? 485 : 475;
  const h = Math.min(stockList ? 700 : 600, (gridBottom - gridTop - gapY * (rows - 1)) / rows);
  const heavy: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1, textShadow: "0 10px 30px rgba(8,20,110,0.4)", whiteSpace: "nowrap" };
  return (
    <AbsoluteFill>
      <BrandBackground drift={false} />
      <Burst x={540} y={1000} r={1200} rot={6} opacity={0.16} rays={22} />
      {/* logo */}
      <div style={{ position: "absolute", top: stockList ? 70 : 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: stockList ? 7 : 10 }}>
        <Img src={staticFile("logo/city.png")} style={{ width: stockList ? 230 : 300 }} />
        <Img src={staticFile("logo/storema.png")} style={{ width: stockList ? 230 : 300 }} />
      </div>
      {/* title (optional) */}
      {header && <div style={{ position: "absolute", top: 345, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {title && <div style={{ ...heavy, fontSize: title.length > 16 ? 64 : 78, letterSpacing: 1 }}>{title}</div>}
        {subtitle && (
          <div dir="auto" style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 36, padding: "4px 28px 8px", borderRadius: 999, boxShadow: "0 10px 26px rgba(6,14,90,0.3)", whiteSpace: "nowrap" }}>{subtitle}</div>
        )}
      </div>}
      {/* products */}
      <div style={{ position: "absolute", top: gridTop, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: gapX, rowGap: gapY }}>
        {items.slice(0, 6).map((it, i) => (
          it.stock ? <StockCard key={i} it={it} w={w} h={h} maxRows={maxRows} /> : <Card key={i} it={it} w={w} h={h} />
        ))}
      </div>
      {/* how to order */}
      <div style={{ position: "absolute", top: footTop, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: stockList ? 10 : 14 }}>
        <div dir="rtl" style={{ ...heavy, fontSize: 44, textAlign: "center" }}>كوموندي دابا فـ WhatsApp</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}>
            <LineIcon name="call" size={38} stroke={9} color="#fff" />
          </div>
          <div style={{ ...heavy, fontSize: 52 }}>{whatsapp}</div>
        </div>
        <div style={{ display: "flex", gap: 22, alignItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#fff" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><LineIcon name="instagram" size={40} stroke={8} />{SOCIAL.instagram}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><FacebookGlyph size={40} />{SOCIAL.facebook}</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.9)" }}>{footnote}</div>
      </div>
      <div style={{ position: "absolute", right: 58, top: footTop }}>
        <Citybot id="pricelist" width={170} expression="happy" mouth="smile" tilt={6} rightArm={{ rot: 72, hand: "thumb" }} leftArm={{ rot: 30, hand: "open" }} hover={8} />
      </div>
      {/* website bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: COLORS.blue, letterSpacing: 4 }}>
        WWW.CITYSTORE.MA
      </div>
    </AbsoluteFill>
  );
};
