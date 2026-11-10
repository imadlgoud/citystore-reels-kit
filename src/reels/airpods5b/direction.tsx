import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { apev, apscene, APTL } from "./timeline";

// Citybot's acting for the AirPods 5 reel: shrugs at "still no AirPods?", reacts to "half the experience", then presents
// each feature from the corner.
const intro = apscene("intro"), st = apscene("anc"), tr = apscene("trans"), fd = apscene("feat");
const trust = apscene("trust"), cta = apscene("cta"), end = apscene("end");
const no = apev("hook.no"), here = apev("hook.half");

const gestures: Gesture[] = [
  { from: 4, to: no - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: no, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 14 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, st, tr, fd].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: apev("anc.pct"), to: st.to - 4, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: apev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: apev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: apev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: apev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: apev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: apev("end.wink"), to: APTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "neutral";
  if (f >= apev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= apev("cta.wave") && f < cta.to) return "happy";
  if (f >= apev("trust.thumb") && f < trust.to) return "proud";
  if (f >= apev("ft.water") && f < fd.to) return "happy";
  if (f >= apev("tr.lang") && f < tr.to) return "excited";
  if (f >= apev("anc.pct") && f < st.to) return "excited";
  if (f >= apev("anc.vs") && f < st.to) return "happy";
  return "neutral";
};

export const airpods5bDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: apev("anc.pct"), dur: 12, height: 50 },
    { at: apev("tr.lang"), dur: 10, height: 40 },
    { at: apev("ft.water"), dur: 10, height: 34 },
    { at: apev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [no, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [apev("end.wink") - 3, -6], [apev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [apev("end.wink") - 4, 0.5], [apev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [apev("end.wink") - 4, -0.8], [apev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
