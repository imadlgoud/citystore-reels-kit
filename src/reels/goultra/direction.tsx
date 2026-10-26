import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { guev, guscene, GUTL } from "./timeline";

// Citybot's acting for the Insta360 GO Ultra reel: shrugs at "film or live?", cheers at "both!", then presents each
// feature from the corner.
const intro = guscene("intro"), chip = guscene("magnet"), ai = guscene("video"), ports = guscene("pod"), last = guscene("tripod");
const trust = guscene("trust"), cta = guscene("cta"), end = guscene("end");
const price = guev("hook.live"), here = guev("hook.both");

const gestures: Gesture[] = [
  { from: 4, to: price - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: price, to: here - 2, arm: "left", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: price, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, chip, ai, ports, last].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: guev("vd.4k"), to: guev("vd.steady") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: guev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: guev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: guev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: guev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: guev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: guev("end.wink"), to: GUTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "happy";
  if (f >= guev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= guev("cta.wave") && f < cta.to) return "happy";
  if (f >= guev("trust.thumb") && f < trust.to) return "proud";
  if (f >= guev("tp.remote") && f < last.to) return "happy";
  if (f >= guev("pd.self") && f < ports.to) return "happy";
  if (f >= guev("vd.4k") && f < ai.to) return "excited";
  if (f >= guev("mg.clip") && f < chip.to) return "happy";
  return "neutral";
};

export const goultraDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: guev("mg.clip") + 6, dur: 10, height: 36 },
    { at: guev("vd.4k"), dur: 12, height: 50 },
    { at: guev("pd.water"), dur: 10, height: 34 },
    { at: guev("tp.remote"), dur: 10, height: 40 },
    { at: guev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [price, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [guev("end.wink") - 3, -6], [guev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [guev("end.wink") - 4, 0.5], [guev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [guev("end.wink") - 4, -0.8], [guev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
