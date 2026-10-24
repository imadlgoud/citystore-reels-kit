import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { rzev, rzscene, RZTL } from "./timeline";

// Citybot's acting for the Razer Hammerhead USB-C ANC reel: shocked at the K.O., shakes "no" at the wireless headset,
// then presents each feature from the corner.
const intro = rzscene("intro"), cab = rzscene("cable"), anc = rzscene("anc"), tips = rzscene("tips"), rem = rzscene("remote");
const trust = rzscene("trust"), cta = rzscene("cta"), end = rzscene("end");
const price = rzev("hook.dead"), here = rzev("hook.kit");

const gestures: Gesture[] = [
  { from: 4, to: price - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: price, to: here - 2, arm: "left", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: price, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 120, hand: "open" }, osc: 24 }, // "no no"
  ...[intro, cab, anc, tips, rem].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: rzev("anc.focus"), to: anc.to - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: rzev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rzev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: rzev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rzev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: rzev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: rzev("end.wink"), to: RZTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "proud" : f >= price ? "neutral" : "excited";
  if (f >= rzev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= rzev("cta.wave") && f < cta.to) return "happy";
  if (f >= rzev("trust.thumb") && f < trust.to) return "proud";
  if (f >= rzev("rm.talk") && f < rem.to) return "happy";
  if (f >= rzev("tp.comfy") && f < tips.to) return "happy";
  if (f >= rzev("anc.focus") && f < anc.to) return "excited";
  if (f >= rzev("cb.nolag") && f < cab.to) return "happy";
  return "neutral";
};

export const razerDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: price, dur: 8, height: 30 },
    { at: rzev("cb.nolag"), dur: 10, height: 36 },
    { at: rzev("anc.focus"), dur: 12, height: 48 },
    { at: rzev("tp.comfy"), dur: 10, height: 30 },
    { at: rzev("rm.calls"), dur: 10, height: 36 },
    { at: rzev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [price, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [rzev("end.wink") - 3, -6], [rzev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [rzev("end.wink") - 4, 0.5], [rzev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [rzev("end.wink") - 4, -0.8], [rzev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
