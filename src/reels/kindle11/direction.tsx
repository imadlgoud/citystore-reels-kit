import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { k11ev, k11scene, K11TL } from "./timeline";

// Citybot's acting for the Kindle 11th gen reel: amazed by the book stack, pats its "pocket", then presents each feature
// from the corner; sleepy-happy during the night-reading scene.
const intro = k11scene("intro"), screen = k11scene("screen"), st = k11scene("storage"), li = k11scene("light"), bat = k11scene("battery");
const trust = k11scene("trust"), cta = k11scene("cta"), end = k11scene("end");
const shrink = k11ev("hook.shrink"), pocket = k11ev("hook.pocket");

const gestures: Gesture[] = [
  { from: 4, to: shrink - 2, arm: "left", pose: { rot: 150, hand: "open" }, osc: 6 }, // "so many books!"
  { from: 4, to: shrink - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 6 },
  { from: pocket, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, screen, st, li, bat].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: k11ev("st.light"), to: st.to - 2, arm: "left", pose: { rot: 130, hand: "open" }, osc: 8 },
  { from: k11ev("bat.weeks"), to: k11ev("bat.usbc") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: k11ev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: k11ev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: k11ev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: k11ev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: k11ev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: k11ev("end.wink"), to: K11TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= pocket ? "excited" : "happy";
  if (f >= k11ev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= k11ev("cta.wave") && f < cta.to) return "happy";
  if (f >= k11ev("trust.thumb") && f < trust.to) return "proud";
  if (f >= k11ev("bat.weeks") && f < bat.to) return "excited";
  if (f >= k11ev("li.night") && f < li.to) return "happy";
  if (f >= k11ev("st.books") && f < st.to) return "excited";
  if (f >= k11ev("sc.paper") && f < screen.to) return "happy";
  return "neutral";
};

export const kindle11Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: pocket, dur: 12, height: 56 },
    { at: k11ev("sc.eink"), dur: 10, height: 34 },
    { at: k11ev("st.books"), dur: 12, height: 44 },
    { at: k11ev("li.dark"), dur: 10, height: 30 },
    { at: k11ev("bat.weeks"), dur: 12, height: 50 },
    { at: k11ev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - pocket, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [shrink, -5], [pocket, 3], [pocket + 8, -6], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [k11ev("end.wink") - 3, -6], [k11ev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: f < pocket ? -0.8 : -0.3 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [k11ev("end.wink") - 4, 0.5], [k11ev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [k11ev("end.wink") - 4, -0.8], [k11ev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [pocket, pocket + 1, pocket + 8], [0, 0.6, 0], clamp)),
};
