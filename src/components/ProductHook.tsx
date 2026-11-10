import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../brand";
import { shake, slam } from "../anim";
import { ProductImage } from "./ProductImage";
import { Burst, SceneShell, useSceneFrame } from "./SceneShell";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#FF3B5C";

/*
 * Product-first hook (house rule since Nov 2026: 54-68 % of viewers skipped our reels in the first 3 s).
 * Frame 0 already shows, fully drawn (no pop-in, no white flash), so the first frame works as the feed preview:
 *   - the real product, big, centred in the safe area (bottom edge above Citybot's corner),
 *   - the hook line from the VO in a white pill at the top,
 *   - an optional red tag above it ("قبل ما تشري", "18 Pro ولا 17 Pro؟", ...).
 * It keeps moving from frame 0 (slow push-in, float, light sweep, rotating rays), and `punch` swaps the pill for the
 * second half of the hook with a shake. `children` draws an optional gag on top (empty slot, "?" badge, VS, ...).
 * Pair it with `hookCorner: true` in the reel's Direction so Citybot starts in the lower-left corner.
 */
export const ProductHook: React.FC<{
  src: string;
  aspect: number; // height / width of the cut-out
  /** product box: width in px and centre x; height follows the aspect and is capped so it stays above Citybot */
  width?: number;
  cx?: number;
  top?: number;
  hook: string;
  tag?: string;
  punch?: { at: number; text: string };
  dir?: "rtl" | "ltr";
  children?: React.ReactNode;
}> = ({ src, aspect, width = 620, cx = 505, top = 430, hook, tag, punch, dir = "rtl", children }) => {
  const frame = useSceneFrame("hook");
  const maxH = 1120 - top; // Citybot's corner starts around y 1140
  const w = Math.min(width, maxH / aspect);
  const zoom = interpolate(frame, [0, 120], [1, 1.08], clamp);
  const float = Math.sin((frame / 30) * Math.PI * 0.8) * 10;
  const sweep = interpolate(frame, [6, 30], [-0.3, 1.3], clamp);
  const punched = punch && frame >= punch.at;
  const sk = punch ? shake(frame, punch.at, 12, 9) : { x: 0, y: 0 };
  const pill: React.CSSProperties = {
    background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, padding: "4px 34px 12px", borderRadius: 999,
    boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap",
  };
  return (
    <SceneShell id="hook" noIn shakeX={sk.x} shakeY={sk.y}>
      <Burst x={cx} y={top + (w * aspect) / 2} r={950} rot={frame * 0.6} opacity={0.22} rays={20} />
      <div style={{ position: "absolute", left: cx - w / 2, top: top + float, transform: `scale(${zoom})`, filter: "drop-shadow(0 34px 44px rgba(6,14,90,0.55))" }}>
        <ProductImage src={src} aspect={aspect} width={w} sweep={sweep} />
      </div>
      {children}
      <div style={{ position: "absolute", left: 0, right: 70, top: tag ? 196 : 236, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 20 }}>
        {tag && (
          <div dir={dir} style={{ background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "2px 26px 8px", borderRadius: 14, transform: "rotate(-2deg)", boxShadow: "0 10px 24px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>
            {tag}
          </div>
        )}
        {punched ? (
          <div dir={dir} style={{ ...pill, ...slam(frame, punch!.at, 2.4), fontSize: 58 }}>{punch!.text}</div>
        ) : (
          <div dir={dir} style={{ ...pill, fontSize: hook.length > 30 ? 46 : 54 }}>{hook}</div>
        )}
      </div>
    </SceneShell>
  );
};
