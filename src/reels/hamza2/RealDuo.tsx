import React from "react";
import { Img, staticFile } from "remotion";
import { MatchG } from "./Match";

/*
 * The REAL iPhone Duo (official Apple photos supplied by City Store, Night Sky), with a book-style opening:
 *  - folded: the official folded front (public/hamza2/products/duo_folded_night.png, cut from iphoneduo2 flat_night.png)
 *  - opening: it hands over to the official unfolded photo (duo_open_night.png, cut from night.png); the unfolded
 *    photo's right half swings open around the hinge (CSS 3D), like a book cover, while the left half stays.
 * The invented match is laid over the real screens, clipped to each screen's outline (measured on the photos).
 * Coordinates below are in the photos' original pixels (before the 2.5x enhance): open 490 x 427, hinge at x = 248;
 * folded 314 x 639.
 */
const OPEN = { w: 490, h: 427, hinge: 248 };
const FOLD = { w: 314, h: 639 };
const SCR_L = "21,15 248,31 248,397 23,412";
const SCR_R = "248,31 470,14 468,411 248,397";
const SCR_F = { x: 26, y: 18, w: 274, h: 607, r: 22 };

/** matchOn: 0 = the official screen (real wallpaper), 1 = the invented match on the screens */
/** screen: optional HTML content shown on the open inner screen (fills its bounding box, clipped to its outline); it
 *  replaces the match. Its box is SCREEN_BOX.w x SCREEN_BOX.h original pixels, scaled by w / 490. */
export const SCREEN_BOX = { x: 21, y: 14, w: 449, h: 398 };
export const RealDuo: React.FC<{ w: number; open: number; t: number; id: string; matchOn?: number; screen?: React.ReactNode; style?: React.CSSProperties }> = ({ w, open, t, id, matchOn = 1, screen, style }) => {
  const s = w / OPEN.w, H = OPEN.h * s;
  const fs = H / FOLD.h, fw = FOLD.w * fs; // folded photo at the same height
  const halfL = OPEN.hinge * s;
  const shift = (1 - open) * (w / 2 - halfL / 2);
  const showFold = 1 - Math.min(1, Math.max(0, open / 0.18));
  const showOpen = Math.min(1, Math.max(0, (open - 0.04) / 0.16));
  if (screen) matchOn = 0;
  const match = (clip: string) => (
    <g clipPath={`url(#${clip})`} opacity={matchOn}>
      <g transform="translate(21 14)">
        <MatchG w={449} h={398} t={t} ballR={7} playerR={10} />
      </g>
    </g>
  );
  return (
    <div style={{ position: "relative", width: w, height: H, perspective: w * 3, ...style }}>
      {/* folded (real photo) */}
      {showFold > 0 && (
        <div style={{ position: "absolute", left: (w - fw) / 2, top: 0, width: fw, height: H, opacity: showFold }}>
          <Img src={staticFile("hamza2/products/duo_folded_night.png")} style={{ width: "100%", height: "100%", display: "block" }} />
          <svg viewBox={`0 0 ${FOLD.w} ${FOLD.h}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs><clipPath id={`${id}-f`}><rect x={SCR_F.x} y={SCR_F.y} width={SCR_F.w} height={SCR_F.h} rx={SCR_F.r} /></clipPath></defs>
            <g clipPath={`url(#${id}-f)`} opacity={matchOn}>
              <g transform={`translate(${SCR_F.x} ${SCR_F.y})`}><MatchG w={SCR_F.w} h={SCR_F.h} t={t} ballR={6} playerR={9} /></g>
            </g>
            <circle cx={282} cy={104} r={10} fill="#05070C" />
          </svg>
        </div>
      )}
      {showOpen > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${shift}px)`, transformStyle: "preserve-3d", opacity: showOpen }}>
          {/* left half (static) */}
          <div style={{ position: "absolute", left: 0, top: 0, width: halfL, height: H, overflow: "hidden" }}>
            <Img src={staticFile("hamza2/products/duo_open_night.png")} style={{ width: w, height: H, display: "block" }} />
            <svg viewBox={`0 0 ${OPEN.w} ${OPEN.h}`} style={{ position: "absolute", left: 0, top: 0, width: w, height: H }}>
              <defs><clipPath id={`${id}-l`}><polygon points={SCR_L} /></clipPath></defs>
              {match(`${id}-l`)}
            </svg>
          </div>
          {/* right half swings open around the hinge */}
          <div style={{ position: "absolute", left: halfL, top: 0, width: w - halfL, height: H, overflow: "hidden", transformOrigin: "0 50%", transform: `rotateY(${-180 * (1 - open)}deg)`, backfaceVisibility: "hidden" }}>
            <Img src={staticFile("hamza2/products/duo_open_night.png")} style={{ width: w, height: H, marginLeft: -halfL, display: "block" }} />
            <svg viewBox={`${OPEN.hinge} 0 ${OPEN.w - OPEN.hinge} ${OPEN.h}`} style={{ position: "absolute", left: 0, top: 0, width: w - halfL, height: H }}>
              <defs><clipPath id={`${id}-r`}><polygon points={SCR_R} /></clipPath></defs>
              {match(`${id}-r`)}
            </svg>
          </div>
        </div>
      )}
      {screen && open > 0.98 && (
        <div style={{ position: "absolute", left: SCREEN_BOX.x * s, top: SCREEN_BOX.y * s, width: SCREEN_BOX.w * s, height: SCREEN_BOX.h * s, overflow: "hidden", clipPath: "polygon(0.0% 0.3%, 50.6% 4.3%, 100.0% 0.0%, 99.6% 99.7%, 50.6% 96.2%, 0.4% 100.0%)" }}>
          {screen}
        </div>
      )}
    </div>
  );
};
