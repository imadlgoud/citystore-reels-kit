import React from "react";
import { Match } from "./Match";

/*
 * iPhone Duo device frame (Night Sky by default) with a book-style hinge, built with CSS 3D:
 * the right panel is double-sided and rotates around the centre hinge. open = 0: folded (the right panel lies over the
 * left one and shows its back = the 5.4" outer screen); open = 1: flat, the 7.6" inner screen spans both panels.
 * Every screen shows the same invented match (Match). `w` = width of ONE panel; the open device is 2w wide.
 */
export const DuoDevice: React.FC<{ w: number; open: number; t: number; colour?: "night" | "white"; style?: React.CSSProperties }> = ({ w, open, t, colour = "night", style }) => {
  const h = w * 2.08;
  const frame = colour === "night" ? "#232A3B" : "#E6E2DA";
  const edge = colour === "night" ? "#3A4460" : "#FFFFFF";
  const bez = w * 0.045;
  const ang = -180 * (1 - open); // right panel rotation around the hinge
  const sw = 2 * (w - bez * 1.5), sh = h - bez * 2; // inner screen (both halves)
  const panel: React.CSSProperties = { position: "absolute", top: 0, width: w, height: h, borderRadius: w * 0.14, background: frame, boxShadow: `inset 0 0 0 ${w * 0.012}px ${edge}` };
  const shift = (1 - open) * (w / 2); // keep the folded phone centred where the open device is centred
  return (
    <div style={{ position: "relative", width: 2 * w, height: h, perspective: w * 9, ...style }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shift}px)`, transformStyle: "preserve-3d" }}>
        {/* left panel: inner screen, left half */}
        <div style={{ ...panel, left: 0, borderTopRightRadius: w * 0.02, borderBottomRightRadius: w * 0.02 }}>
          <div style={{ position: "absolute", left: bez, top: bez, width: w - bez * 1.5, height: sh, overflow: "hidden", borderRadius: `${w * 0.1}px ${w * 0.01}px ${w * 0.01}px ${w * 0.1}px`, background: "#000" }}>
            <Match w={sw} h={sh} t={t} ballR={sw * 0.018} />
          </div>
        </div>
        {/* right panel: rotates around its left edge (the hinge) */}
        <div style={{ position: "absolute", left: w, top: 0, width: w, height: h, transformOrigin: "0 50%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ ...panel, left: 0, backfaceVisibility: "hidden", borderTopLeftRadius: w * 0.02, borderBottomLeftRadius: w * 0.02 }}>
            <div style={{ position: "absolute", left: bez * 0.5, top: bez, width: w - bez * 1.5, height: sh, overflow: "hidden", borderRadius: `${w * 0.01}px ${w * 0.1}px ${w * 0.1}px ${w * 0.01}px`, background: "#000" }}>
              <Match w={sw} h={sh} t={t} ballR={sw * 0.018} style={{ marginLeft: -(w - bez * 1.5) }} />
            </div>
          </div>
          {/* back face = outer (cover) screen, seen when folded */}
          <div style={{ ...panel, left: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            <div style={{ position: "absolute", left: bez, top: bez, width: w - bez * 2, height: sh, overflow: "hidden", borderRadius: w * 0.1, background: "#000" }}>
              <Match w={w - bez * 2} h={sh} t={t} ballR={(w - bez * 2) * 0.03} />
              <div style={{ position: "absolute", left: "50%", top: w * 0.05, width: w * 0.09, height: w * 0.09, marginLeft: -w * 0.045, borderRadius: "50%", background: "#05070C" }} />
            </div>
          </div>
        </div>
        {/* hinge line */}
        <div style={{ position: "absolute", left: w - w * 0.012, top: h * 0.02, width: w * 0.024, height: h * 0.96, background: "rgba(0,0,0,0.35)", opacity: open, transform: "translateZ(1px)" }} />
      </div>
    </div>
  );
};
